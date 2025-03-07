import { getAWSConfig } from '@/services/aws/config';
import {
  Address,
  DescribeAddressesCommand, DescribeAddressesCommandOutput,
  DescribeVolumesCommand,
  DescribeVolumesCommandOutput,
  EC2Client
} from '@aws-sdk/client-ec2';
import { ElasticIP } from '@/types/aws';

export class NetworkService {
  static async listElasticIPs(): Promise<ElasticIP[]> {
    try {
      const config = getAWSConfig();
      if (!config) throw new Error("no config found");

      // @ts-ignore
      const client = new EC2Client(config);
      const command = new DescribeAddressesCommand({});


      // @ts-ignore
      const response: DescribeAddressesCommandOutput = await client.send(command);

      const ips: ElasticIP[] = []

      if (response.Addresses) {
        for (const address of response.Addresses) {

          // @ts-ignore
          const nameTag = address.Tags?.find(tag => tag.Key === 'Name');

          ips.push({
              allocationId: address.AllocationId || '',
              publicIp: address.PublicIp || '',
              instanceId: address.InstanceId,
              name: nameTag?.Value
          });
        }
      }
      return ips;
    } catch (err) {
      console.error("Error listing Elastic IPs", err);
      throw new Error("Failed to list Elastic IPs");
    }
  }
}