import type { APIRoute } from 'astro';

interface JiraIssueData {
  devId: string;
  title: string;
  description: string;
  requester: string;
  country: string;
  product: string;
  translations?: {
    jiraRequester: string;
    jiraCountry: string;
    jiraProduct: string;
    jiraDescription: string;
  };
}

interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
}

class JiraService {
  private config: JiraConfig;

  constructor() {
    this.config = {
      baseUrl: import.meta.env.JIRA_BASE_URL || process.env.JIRA_BASE_URL || '',
      email: import.meta.env.JIRA_EMAIL || process.env.JIRA_EMAIL || '',
      apiToken: import.meta.env.JIRA_API_TOKEN || process.env.JIRA_API_TOKEN || '',
      projectKey: import.meta.env.JIRA_PROJECT_KEY || process.env.JIRA_PROJECT_KEY || 'DEV'
    };
  }

  private getAuthHeader(): string {
    const credentials = `${this.config.email}:${this.config.apiToken}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  }

  private validateConfig(): void {
    if (!this.config.baseUrl || !this.config.email || !this.config.apiToken) {
      throw new Error('Jira configuration is incomplete. Please check JIRA_BASE_URL, JIRA_EMAIL, and JIRA_API_TOKEN environment variables.');
    }
  }

  public isConfigured(): boolean {
    return !!(this.config.baseUrl && this.config.email && this.config.apiToken);
  }

  async createIssue(issueData: JiraIssueData): Promise<{ issueKey: string; issueId: string }> {
    this.validateConfig();

    const issuePayload = {
      fields: {
        project: {
          key: this.config.projectKey
        },
        summary: `[${issueData.devId}] ${issueData.title}`,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `DevID: ${issueData.devId}\n\n`
                },
                {
                  type: 'text',
                  text: `${issueData.translations?.jiraRequester || 'Requester'}: ${issueData.requester}\n`
                },
                {
                  type: 'text',
                  text: `${issueData.translations?.jiraCountry || 'Country'}: ${issueData.country}\n`
                },
                {
                  type: 'text',
                  text: `${issueData.translations?.jiraProduct || 'Product'}: ${issueData.product}\n\n`
                },
                {
                  type: 'text',
                  text: `${issueData.translations?.jiraDescription || 'Description'}: ${issueData.description}`
                }
              ]
            }
          ]
        },
        issuetype: {
          name: 'Story'
        }
      }
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(issuePayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create Jira issue: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      
      // Add automatic comment
      await this.addComment(result.key, "This comment is automatically generated upon creating the Jira task. The development request is in status: PENDING.");
      
      // Transition to "Waiting for approval" status
      await this.transitionToWaitingForApproval(result.key);
      
      return {
        issueKey: result.key,
        issueId: result.id
      };
    } catch (error) {
      console.error('Error creating Jira issue:', error);
      throw error;
    }
  }

  async getAvailableTransitions(issueKey: string): Promise<any[]> {
    this.validateConfig();

    try {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue/${issueKey}/transitions`, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Failed to get transitions for Jira issue ${issueKey}: ${response.status} ${response.statusText} - ${errorText}`);
        return [];
      }

      const result = await response.json();
      return result.transitions || [];
    } catch (error) {
      console.warn('Error getting Jira issue transitions:', error);
      return [];
    }
  }

  async transitionToWaitingForApproval(issueKey: string): Promise<void> {
    this.validateConfig();

    try {
      // Get available transitions
      const transitions = await this.getAvailableTransitions(issueKey);
      
      // Find the transition for "Waiting for approval" by name
      const waitingTransition = transitions.find(t => 
        t.name && t.name.toLowerCase().includes('waiting for approval')
      );

      if (!waitingTransition) {
        console.warn(`No 'Waiting for approval' transition found for issue ${issueKey}. Available transitions:`, transitions.map(t => ({ id: t.id, name: t.name })));
        return;
      }

      const transitionPayload = {
        transition: {
          id: waitingTransition.id
        }
      };

      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue/${issueKey}/transitions`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transitionPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Failed to transition Jira issue ${issueKey}: ${response.status} ${response.statusText} - ${errorText}`);
      } else {
        console.log(`Successfully transitioned issue ${issueKey} to 'Waiting for approval'`);
      }
    } catch (error) {
      console.warn('Error transitioning Jira issue:', error);
    }
  }

  async addComment(issueKey: string, commentText: string): Promise<void> {
    this.validateConfig();

    const commentPayload = {
      body: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: commentText
              }
            ]
          }
        ]
      }
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue/${issueKey}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to add comment to Jira issue ${issueKey}: ${response.status} ${response.statusText} - ${errorText}`);
        // Don't throw error for comment failure, just log it
      }
    } catch (error) {
      console.error('Error adding comment to Jira issue:', error);
      // Don't throw error for comment failure, just log it
    }
  }

  async attachFile(issueKey: string, fileBuffer: Buffer, fileName: string): Promise<void> {
    this.validateConfig();

    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('file', blob, fileName);

    try {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue/${issueKey}/attachments`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'X-Atlassian-Token': 'no-check'
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to attach file to Jira issue: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.log(`File ${fileName} successfully attached to issue ${issueKey}`);
    } catch (error) {
      console.error('Error attaching file to Jira issue:', error);
      throw error;
    }
  }

  async createIssueWithAttachment(issueData: JiraIssueData, pdfBuffer: Buffer, fileName: string): Promise<{ issueKey: string; issueId: string }> {
    try {
      // First, create the issue
      const issueResult = await this.createIssue(issueData);
      
      // Then, attach the PDF
      await this.attachFile(issueResult.issueKey, pdfBuffer, fileName);
      
      return issueResult;
    } catch (error) {
      console.error('Error creating Jira issue with attachment:', error);
      throw error;
    }
  }

  async createIssueWithMultipleAttachments(issueData: JiraIssueData, pdfBuffer: Buffer, pdfFileName: string, imageFiles: { [key: string]: File }): Promise<{ issueKey: string; issueId: string }> {
    try {
      // First, create the issue
      const issueResult = await this.createIssue(issueData);
      
      // Attach the PDF
      await this.attachFile(issueResult.issueKey, pdfBuffer, pdfFileName);
      
      // Attach all image files
      for (const [fieldName, file] of Object.entries(imageFiles)) {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          await this.attachFile(issueResult.issueKey, buffer, file.name);
        }
      }
      
      return issueResult;
    } catch (error) {
      console.error('Error creating Jira issue with multiple attachments:', error);
      throw error;
    }
  }
}

export default JiraService;
export type { JiraIssueData };