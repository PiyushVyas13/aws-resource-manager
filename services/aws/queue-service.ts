import { EBSVolume, SQSQueue } from '@/types/aws';
import { getAWSConfig } from '@/services/aws/config';
import { DescribeVolumesCommand, DescribeVolumesCommandOutput, EC2Client } from '@aws-sdk/client-ec2';
import {
  GetQueueAttributesCommand,
  GetQueueAttributesCommandOutput,
  ListQueuesCommand,
  ListQueuesCommandOutput,
  SQSClient
} from '@aws-sdk/client-sqs';

export class QueueService {
  static async listQueues(): Promise<SQSQueue[]> {
    try {
      const config = getAWSConfig();
      if (!config) throw new Error("no config found");

      // @ts-ignore
      const client = new SQSClient(config);
      const command = new ListQueuesCommand({});


      // @ts-ignore
      const response: ListQueuesCommandOutput = await client.send(command);

      const queues: SQSQueue[] = []

      if (response.QueueUrls) {
        for (const url of response.QueueUrls) {
          const parts = url.split("/");
          const name = parts[parts.length - 1];

          try {
            const attributeCommand = new GetQueueAttributesCommand({
              QueueUrl: url,
              AttributeNames: ['ApproximateNumberOfMessages']
            });

            // @ts-ignore
            const attrResponse: GetQueueAttributesCommandOutput = await client.send(attributeCommand);

            const messageCount = attrResponse.Attributes?.ApproximateNumberOfMessages ?
              parseInt(attrResponse.Attributes.ApproximateNumberOfMessages) : 0;

            queues.push({
              name,
              url,
              messageCount
            });
          } catch (err) {
            console.warn(`Could not get attribute for queue ${name}`)
            queues.push({
              name,
              url,
              messageCount: 0
            })
          }
        }
      }
      return queues;
    } catch (err) {
      console.error("Error listing EBS volumes", err);
      throw new Error("Failed to list EBS volumes");
    }
  }
}