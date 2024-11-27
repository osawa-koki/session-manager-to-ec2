import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
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
      role: new iam.Role(this, 'EC2Role', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        ],
      }),
    });

    this.instance = instance;
  }
}
