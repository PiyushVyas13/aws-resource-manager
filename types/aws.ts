export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export interface EC2Instance {
  id: string;
  name: string;
  state: string;
  type: string;
  publicIp?: string;
}

export interface RDSInstance {
  id: string;
  name: string;
  state: string;
  engine: string;
  size: string;
}

export interface S3Bucket {
  name: string;
  createdAt: Date;
  region: string;
}

export interface DynamoDBTable {
  name: string;
  status: string;
  itemCount: number;
}

export interface SQSQueue {
  url: string;
  name: string;
  messageCount: number;
}

export interface ElasticIP {
  allocationId: string;
  publicIp: string;
  instanceId?: string;
  name?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  resources: {
    compute: {
      ec2: EC2Instance[];
      lambda: string[];
    };
    database: {
      rds: RDSInstance[];
      dynamodb: DynamoDBTable[];
    };
    storage: {
      s3: S3Bucket[];
      ebs: string[];
    };
    network: {
      elasticIp: ElasticIP[];
    };
    other: {
      sqs: SQSQueue[];
    };
  };
}
