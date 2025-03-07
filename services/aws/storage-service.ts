import { DynamoDBTable, EBSVolume, EC2Instance as EC2InstanceModel, S3Bucket } from '@/types/aws';
import { getAWSConfig } from '@/services/aws/config';
import {
  GetBucketLocationCommand,
  GetBucketLocationCommandOutput,
  ListBucketsCommand,
  ListBucketsCommandOutput,
  S3Client
} from '@aws-sdk/client-s3';
import {
  DescribeInstancesCommand,
  DescribeInstancesResult,
  DescribeVolumesCommand, DescribeVolumesCommandOutput,
  EC2Client
} from '@aws-sdk/client-ec2';

export class StorageService {
  static async listS3Buckets(): Promise<S3Bucket[]> {
    try {
      const config = await getAWSConfig();
      if(!config) throw new Error("credentials not found");


      // @ts-ignore
      const client = new S3Client(config);
      const command = new ListBucketsCommand({});

      // @ts-ignore
      const response: ListBucketsCommandOutput = await client.send(command);
      const buckets: S3Bucket[] = [];

      if(response.Buckets) {
        for(const bucket of response.Buckets) {
          if(bucket.Name && bucket.CreationDate) {
              buckets.push({
                name: bucket.Name,
                createdAt: bucket.CreationDate,
                region: bucket.BucketRegion || "us-east-1",
              });
          }
        }
      }

      return buckets;

    } catch (err) {
      console.error('Error listing s3 buckets:', err);
      throw new Error('Failed to list s3 buckets');
    }
  }

  static async listEBSVolumes() {
    try {
      const config = getAWSConfig();
      if (!config) throw new Error("no config found");

      // @ts-ignore
      const client = new EC2Client(config);
      const command = new DescribeVolumesCommand({});


      // @ts-ignore
      const response: DescribeVolumesCommandOutput = await client.send(command);

      const volumes: EBSVolume[] = []

      if (response.Volumes) {
        for (const volume of response.Volumes) {
          if (volume.VolumeId) {
            volumes.push({
              id: volume.VolumeId,
              type: volume.VolumeType || 'standard',
              size: volume.Size || 0
            });
          }
        }
      }
      return volumes;
    } catch (err) {
      console.error("Error listing EBS volumes", err);
      throw new Error("Failed to list EBS volumes");
    }
  }
}