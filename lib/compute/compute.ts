import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface ComputeStackProps extends cdk.StackProps {
  stackName: string;
  vpc: ec2.Vpc;
}

export default class ComputeStack extends cdk.Stack {
  public readonly instance: ec2.Instance;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    const { stackName, vpc } = props;

    super(scope, id, {
      ...props,
      stackName,
    });

    const instance = new ec2.Instance(this, 'MyInstance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      instanceType: new ec2.InstanceType(process.env.EC2_INSTANCE_TYPE!),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
    });

    this.instance = instance;
  }
}
