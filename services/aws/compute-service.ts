import { EC2Instance as EC2InstanceModel } from '@/types/aws';
import { getAWSConfig } from '@/services/aws/config';
import {
  DescribeInstancesCommand,
  DescribeInstancesResult,
  EC2Client,
  StartInstancesCommand, StopInstancesCommand
} from '@aws-sdk/client-ec2';

import {
  InvokeCommand, InvokeCommandOutput,
  LambdaClient,
  ListFunctionsCommand, ListFunctionsCommandOutput
} from '@aws-sdk/client-lambda';

export class ComputeService {
  static async listEC2Instances(): Promise<EC2InstanceModel[]> {
    try {
      const config = getAWSConfig();
      if(!config) throw new Error("no config found");

      // @ts-ignore
      const client = new EC2Client(config);
      const command = new DescribeInstancesCommand({});


      // @ts-ignore
      const response: DescribeInstancesResult = await client.send(command);

      const instances: EC2InstanceModel[] = []

      if(response.Reservations) {
        for(const reservation of response.Reservations) {
          if(reservation.Instances) {
            for (const instance of reservation.Instances) {

              // @ts-ignore
              const nameTag = instance?.Tags?.find(tag => tag.Key === 'Name');

              instances.push({
                id: instance.InstanceId || '',
                name: nameTag?.Value || instance.InstanceId || "Unnamed Instance",
                state: instance?.State?.Name || "Unknown",
                type: instance.InstanceType || "Unknown",
                publicIp: instance.PublicIpAddress,
              });
            }
          }
        }
      }

      return instances;
    } catch (err) {
      console.error("Error listing EC2 resources", err);
      throw new Error("Failed to load EC2 instance");
    }
  }

  static async startInstance(instanceId: string) {
    try {
      const config = await getAWSConfig();
      if(!config) return null;


      // @ts-ignore
      const client = new EC2Client(config);

      const command = new StartInstancesCommand({
        InstanceIds: [instanceId]
      });


      // @ts-ignore
      await client.send(command);
      return true;

    } catch (err) {
      console.error(`Error starting EC2 instance: ${instanceId}`, err);
      throw new Error(`Failed to start instance: ${instanceId}`)
    }
  }

  static async stopInstance(instanceId: string) {
    try {
      const config = await getAWSConfig();
      if(!config) return null;


      // @ts-ignore
      const client = new EC2Client(config);

      const command = new StopInstancesCommand({
        InstanceIds: [instanceId]
      });


      // @ts-ignore
      await client.send(command);
      return true;

    } catch (err) {
      console.error(`Error starting EC2 instance: ${instanceId}`, err);
      throw new Error(`Failed to start instance: ${instanceId}`)
    }
  }

  static async listLambdaFunctions() {
    try {
      const config = await getAWSConfig();
      if(!config) return null;


      // @ts-ignore
      const client = new LambdaClient(config);
      const command = new ListFunctionsCommand({});

      // @ts-ignore
      const response: ListFunctionsCommandOutput = await client.send(command);

      const functionNames: string[] = [];
      if(response.Functions) {
        for(const func of response.Functions) {
          if(func.FunctionName) {
            functionNames.push(func.FunctionName);
          }
        }
      }

      return functionNames;

    } catch (err) {
      console.error(`Error listing lambda functions`, err);
      throw new Error(`Failed to list lambda functions`)
    }
  }

  static async invokeLambdaFunction(functionName: string, payload?: any) {
    try {
      const config = await getAWSConfig();
      if(!config) return null;


      // @ts-ignore
      const client = new LambdaClient(config);

      const payloadBuffer = payload ?
        new TextEncoder().encode(JSON.stringify(payload)) :
        undefined;

      const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: payloadBuffer
      });

      // @ts-ignore
      const response: InvokeCommandOutput = await client.send(command);


      if(response.Payload) {
        const decoder = new TextDecoder();
        const jsonString = decoder.decode(response.Payload);
        try {
          return JSON.parse(jsonString)
        } catch (e) {
          return jsonString
        }
      }

      return null;

    } catch (err) {
      console.error(`Error invoking lambda function ${functionName}`, err);
      throw new Error(`Failed to invoke lambda function ${functionName}`)
    }
  }
}
