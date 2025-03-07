import {CredentialsService} from '@/services/aws/credentials';
import {ComputeService} from '@/services/aws/compute-service';
import { DatabaseService } from '@/services/aws/database-service';
import { NetworkService } from '@/services/aws/network-service';
import { QueueService } from '@/services/aws/queue-service';
import {getAWSConfig, getAWSConfigForRegion} from '@/services/aws/config';

export {
  CredentialsService,
  ComputeService,
  DatabaseService,
  NetworkService,
  QueueService,
  getAWSConfigForRegion,
  getAWSConfig
}