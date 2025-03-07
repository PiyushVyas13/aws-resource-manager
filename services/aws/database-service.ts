import { DynamoDBTable, RDSInstance } from '@/types/aws';
import { getAWSConfig } from '@/services/aws/config';
import {
  DescribeDBInstancesCommand,
  DescribeDBInstancesCommandOutput,
  RDSClient,
  StartDBInstanceCommand, StopDBInstanceCommand
} from '@aws-sdk/client-rds';
import {
  DescribeTableCommand, DescribeTableCommandOutput,
  DynamoDBClient,
  ListTablesCommand,
  ListTablesCommandOutput
} from '@aws-sdk/client-dynamodb';

export class DatabaseService {
  static async listDatabases(): Promise<RDSInstance[]> {
    try {
      const config = await getAWSConfig();
      if(!config)  throw new Error('credentials not found');


      // @ts-ignore
      const client = new RDSClient(config);
      const command = new DescribeDBInstancesCommand({});

      // @ts-ignore
      const response: DescribeDBInstancesCommandOutput = await client.send(command);

      const instances: RDSInstance[] = [];
      if(response.DBInstances) {
        for(const instance of response.DBInstances) {

          instances.push({
              id: instance.DBInstanceIdentifier ||  '',
              name: instance.DBName || instance.DBInstanceIdentifier || 'Unnamed database',
              state: instance.DBInstanceStatus || "Unknown",
              engine: instance.Engine || "Unknown",
              size: instance.DBInstanceClass || "Unknown"
          });
        }
      }

      return instances;

    } catch (err) {
      console.error(`Error listing db instances`, err);
      throw new Error(`Failed to list database instances`)
    }
  }

  static async startInstance(instanceId: string) {
    try {
      const config = await getAWSConfig();
      if(!config)  throw new Error('credentials not found');


      // @ts-ignore
      const client = new RDSClient(config);
      const command = new StartDBInstanceCommand({
        DBInstanceIdentifier: instanceId
      });

      // @ts-ignore
      await client.send(command);
      return true;

    } catch (err) {
      console.error(`Error starting db instance ${instanceId}`, err);
      throw new Error(`Failed to start db instance ${instanceId}`)
    }
  }

  static async stopInstance(instanceId: string) {
    try {
      const config = await getAWSConfig();
      if(!config)  throw new Error('credentials not found');


      // @ts-ignore
      const client = new RDSClient(config);
      const command = new StopDBInstanceCommand({
        DBInstanceIdentifier: instanceId
      });

      // @ts-ignore
      await client.send(command);
      return true;

    } catch (err) {
      console.error(`Error stopping db instance ${instanceId}`, err);
      throw new Error(`Failed to stop db instance ${instanceId}`)
    }
  }

  static async listDynamodbTables() {
    try {
      const config = await getAWSConfig();
      if(!config)  throw new Error('credentials not found');


      // @ts-ignore
      const client = new DynamoDBClient(config);
      const command = new ListTablesCommand({});

      // @ts-ignore
      const response: ListTablesCommandOutput = await client.send(command);
      return response.TableNames || [];

    } catch (err) {
      console.error(`Error listing dynamodb tables`, err);
      throw new Error(`Failed to dynamodb tables`)
    }
  }

  static async getDynamoDBTableDetails(tableName: string): Promise<DynamoDBTable> {
    try {
      const config = await getAWSConfig();
      if(!config)  throw new Error('credentials not found');


      // @ts-ignore
      const client = new DynamoDBClient(config);
      const command = new DescribeTableCommand({
        TableName: tableName
      });

      // @ts-ignore
      const response: DescribeTableCommandOutput = await client.send(command);
      if(!response.Table) {
        throw new Error(`Table ${tableName} not found`)
      }

      return {
        name: tableName,
        status: response.Table.TableStatus || "Unknown",
        itemCount: response.Table.ItemCount || 0
      }

    } catch (err) {
      console.error(`Error getting table details`, err);
      throw new Error(`Failed to get details for table ${tableName}`)
    }
  }

  static async listDynamoDBTablesWithDetails(): Promise<DynamoDBTable[]> {
    try {
      const tableName = await this.listDynamodbTables();
      const tables: DynamoDBTable[] = [];

      for(const name of tableName) {
        try {
          const details = await this.getDynamoDBTableDetails(name);
          tables.push(details);
        } catch (err) {
          console.error(`Skipping table ${name} due to error: `, err)
        }
      }

      return tables;
    } catch (err) {
      console.error('Error listing DynamoDB tables with details:', err);
      throw new Error('Failed to list DynamoDB tables with details');
    }
  }
}