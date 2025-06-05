import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "node:path";
import * as dotenv from "dotenv";
import axios from 'axios';
import https from 'node:https';
dotenv.config({ path: path.join(__dirname, "../.env") });

// API Server URL
const API_SERVER_URL = 'https://mcp-provider.opsnow.io'; 

// HTTPS Agent Configuration
const HTTPS_AGENT_CONFIG = {
  rejectUnauthorized: true
};

// Product key converter mapping table
export const ASSET_PRODUCT_KEY_CONVERTER = {
  aws: {
    'ami': 'ami',
    'api_gateway_api_key': 'api-gateway-apiKey',
    'api_gateway_client_certificate': 'api-gateway-certificate',
    'api_gateway_domain_name': 'api-gateway-domainName',
    'api_gateway_rest_api': 'api-gateway-restApi',
    'api_gateway_usage_plan': 'api-gateway-usagePlan',
    'api_gateway_vpc_link': 'api-gateway-vpcLink',
    'auto_scaling_group': 'auto-scaling-groups',
    'auto_scaling_instance': 'auto-scaling-instance',
    'cloud_front': 'cloud-front',
    'codedeploy_application': 'code-deploy-application',
    'codedeploy_deployment_group': 'code-deploy-deployment',
    'direct_connect': 'direct-connect',
    'dynamodb': 'dynamodb',
    'ebs': 'ebs',
    'ec2': 'ec2',
    'ecs_cluster': 'ecs-cluster',
    'efs': 'efs',
    'eip': 'eip',
    'eks_cluster': 'eks-cluster',
    'elasticache': 'elastic-cache-node',
    'elasticsearch_service': 'elastic-search',
    'fsx': 'fsx',
    'internet_gateway': 'internet-gateways',
    'ivs_channel': 'ivs-channel',
    'ivs_chat_room': 'ivs-chat-room',
    'kinesis_data_analytic': 'kinesis-analytic',
    'kinesis_data_stream': 'kinesis-data-stream',
    'kinesis_data_firehose': 'kinesis-firehose',
    'kinesis_video_stream': 'kinesis-video-stream',
    'kms': 'kms',
    'lambda': 'lambda-functions',
    'launch_configuration': 'launch-configuration',
    'elb': 'load-balancers',
    'media_convert': 'media-convert',
    'amazon_mq': 'mq',
    'managed_workflows_for_apache_airflow': 'mwaa',
    'nat_gateway': 'nat-gateways',
    'network_acl': 'network-acl',
    'eni': 'network-interface',
    'rds': 'rds',
    'rds_cluster': 'rds-cluster',
    'rds_ri': 'rds-reserved-instance',
    'rds_snapshot': 'rds-snapshot',
    'redshift': 'redshift',
    'ec2_ri': 'reserved-instance',
    'route_table': 'route-tables',
    'route53': 'route53',
    's3': 's3',
    'sagemaker_app': 'sagemaker-app',
    'savings_plan': 'savings-plans',
    'security_group': 'security-groups',
    'snapshot': 'snapshot',
    'sqs': 'sqs',
    'subnet': 'subnets',
    'transit_gateway': 'transit-gateway',
    'vpc_endpoint': 'vpc-endpoint',
    'vpc_flow_log': 'vpc-flow-log',
    'vpc': 'vpcs',
    'workspace_bundle': 'workspace-service-bundle',
    'workspace_directory': 'workspace-service-directory',
    'workspace_image': 'workspace-service-image',
    'workspace_ip_group': 'workspace-service-ip-group',
    'workspace': 'workspace-service-workspace',
  },
  azu : {
    'batch_account': 'Microsoft.Batch/batchAccounts',
    'redis': 'Microsoft.Cache/Redis',
    'cdn': 'Microsoft.Cdn/profiles',
    'disk': 'Microsoft.Compute/disks',
    'image': 'Microsoft.Compute/images',
    'snapshot': 'Microsoft.Compute/snapshots',
    'vm': 'Microsoft.Compute/virtualMachines',
    'virtual_machine_scale_sets': 'Microsoft.Compute/virtualMachineScaleSets',
    'data_factory': 'Microsoft.DataFactory/factories',
    'mariadb_server': 'Microsoft.DBforMariaDB/servers',
    'mysql_flexible_server': 'Microsoft.DBforMySQL/flexibleServers',
    'mysql_server': 'Microsoft.DBforMySQL/servers',
    'mysql_database': 'Microsoft.DBforMySQL/servers/databases',
    'postgresql_flexible_server': 'Microsoft.DBforPostgreSQL/flexibleServers',
    'postgresql_server': 'Microsoft.DBforPostgreSQL/servers',
    'cosmos_db': 'Microsoft.DocumentDb/databaseAccounts',
    'namespace': 'Microsoft.EventHub/namespaces',
    'application_insight': 'Microsoft.Insights/components',
    'alert': 'Microsoft.Insights/metricalerts',
    'application_gateway': 'Microsoft.Network/applicationGateways',
    'ddos_protection_plan': 'Microsoft.Network/ddosProtectionPlans',
    'load_balancer': 'Microsoft.Network/loadBalancers',
    'local_network_gateway': 'Microsoft.Network/localNetworkGateways',
    'network_interface': 'Microsoft.Network/networkInterfaces',
    'network_security_group': 'Microsoft.Network/networkSecurityGroups',
    'network_watcher': 'Microsoft.Network/networkWatchers',
    'public_ip_address': 'Microsoft.Network/publicIPAddresses',
    'route_table': 'Microsoft.Network/routeTables',
    'traffic_manager': 'Microsoft.Network/trafficmanagerprofiles',
    'virtual_network_gateway': 'Microsoft.Network/virtualNetworkGateways',
    'virtual_network': 'Microsoft.Network/virtualNetworks',
    'virtual_network_subnet': 'Microsoft.Network/virtualNetworks/subnets',
    'log_analytics_workspace': 'Microsoft.OperationalInsights/workspaces',
    'vault': 'Microsoft.RecoveryServices/vaults',
    'search_service': 'Microsoft.Search/searchServices',
    'managed_instance': 'Microsoft.Sql/managedInstances',
    'mssql_server': 'Microsoft.Sql/servers',
    'mssql_servers_database': 'Microsoft.Sql/servers/databases',
    'mssql_elastic_pool': 'Microsoft.Sql/servers/elasticPools',
    'virtual_cluster': 'Microsoft.Sql/virtualClusters',
    'storage_account': 'Microsoft.Storage/storageAccounts',
    'storage_accounts_blob': 'Microsoft.Storage/storageAccounts/blobServices',
  },
  gcp: {
    'bigquery_dataset': 'bigquery#dataset',
    'bigquery_table': 'bigquery#table',
    'bigtable_cluster': 'bigtable#cluster',
    'bigtable_instance': 'bigtable#instance',
    'ip_address': 'compute#address',
    'autoscaler': 'compute#autoscaler',
    'cloud_function': 'compute#cloudfunction',
    'disk': 'compute#disk',
    'firewall': 'compute#firewall',
    'health_check': 'compute#healthCheck',
    'image': 'compute#image',
    'vm_instance': 'compute#instance',
    'instance_groups': 'compute#instanceGroup',
    'instance_group_manager': 'compute#instanceGroupManager',
    'instance_template': 'compute#instanceTemplate',
    'vpc_network': 'compute#network',
    'route': 'compute#route',
    'snapshot': 'compute#snapshot',
    'subnet': 'compute#subnetwork',
    'vpn_gateway': 'compute#targetVpnGateway',
    'vpn_tunnel': 'compute#vpnTunnel',
    'dataflow_job': 'dataflow#job',
    'dataproc_cluster': 'dataproc#cluster',
    'kubernetes_cluster': 'kubernetes#cluster',
    'redis': 'memorystore#redis',
    'pubsub_snapshot': 'pubsub#snapshots',
    'pubsub_subscription': 'pubsub#subscriptions',
    'pubsub_topic': 'pubsub#topics',
    'sql_instance': 'sql#instance',
    'storage': 'storage#bucket',
  },
};

// 성능 최적화를 위한 정규식 상수
const CLEAN_REGEX = /[$,\s]/g;
const TRAILING_ZEROS_REGEX = /0+$/;
const ZERO_CHECK_REGEX = /^0*\.?0*$/;

// 0 체크 함수
function isZeroString(str: string): boolean {
  if (!str || str === '0') return true;
  const cleaned = str[0] === '-' ? str.slice(1) : str;
  return ZERO_CHECK_REGEX.test(cleaned);
}

// 과학적 표기법 변환 (개선 버전)
function convertScientificNotation(str: string): string {
  const eLower = str.toLowerCase();
  const eIndex = eLower.indexOf('e');
  if (eIndex === -1) return str;

  // 1) 부호 분리
  let mantissa = str.slice(0, eIndex);
  const exp = parseInt(str.slice(eIndex + 1), 10);

  const isNegative = mantissa.startsWith('-');
  if (isNegative) {
    mantissa = mantissa.slice(1);
  } else if (mantissa.startsWith('+')) {
    mantissa = mantissa.slice(1);
  }

  // 2) 정수부/소수부 분리
  let integerDigits: string, fractionalDigits: string;
  const dotIndex = mantissa.indexOf('.');
  if (dotIndex === -1) {
    integerDigits = mantissa;
    fractionalDigits = '';
  } else {
    integerDigits = mantissa.slice(0, dotIndex);
    fractionalDigits = mantissa.slice(dotIndex + 1);
  }

  // 3) 모든 숫자를 연결하고, 맨앞 0제거(단, 전부 0이면 '0')
  const digits = integerDigits + fractionalDigits;
  const pureDigits = digits.replace(/^0+/, '') || '0';

  // 4) 새 소수점 위치 = 기존 정수부 길이 + exp
  const newDotIndex = integerDigits.length + exp;

  let result: string;
  if (newDotIndex <= 0) {
    // (예: "1.23e-5" → "0.0000123")
    const zerosCount = Math.abs(newDotIndex);
    result = '0.' + '0'.repeat(zerosCount) + pureDigits;
  } else if (newDotIndex >= pureDigits.length) {
    // (예: "1.23e2" → "123")
    result = pureDigits + '0'.repeat(newDotIndex - pureDigits.length);
  } else {
    // (중간에 소수점 생길 때)
    const intPart = pureDigits.slice(0, newDotIndex);
    const fracPart = pureDigits.slice(newDotIndex);
    result = intPart + (fracPart ? '.' + fracPart : '');
  }

  return (isNegative ? '-' : '') + result;
}

// 문자열을 정수부/소수부로 분리
function splitNumber(str: string): [string, string] {
  const dotIndex = str.indexOf('.');
  if (dotIndex === -1) {
    return [str || '0', ''];
  }
  if (dotIndex === 0) {
    return ['0', str.slice(1)];
  }
  return [str.slice(0, dotIndex), str.slice(dotIndex + 1)];
}

// BigInt 결과 포맷팅: 소수부 전부 '0' 이면 정수부만 남김
function formatResult(bigIntStr: string, decimalPlaces: number): string {
  if (bigIntStr === '0') return '0';

  const isNegative = bigIntStr.startsWith('-');
  const absStr = isNegative ? bigIntStr.slice(1) : bigIntStr;

  if (decimalPlaces === 0) {
    return bigIntStr;
  }

  let intPart: string;
  let fracPart: string;

  if (absStr.length <= decimalPlaces) {
    // (예: absStr="5", decimalPlaces=3 → intPart="0", fracPart="005")
    intPart = '0';
    fracPart = absStr.padStart(decimalPlaces, '0');
  } else {
    intPart = absStr.slice(0, -decimalPlaces);
    fracPart = absStr.slice(-decimalPlaces);
  }

  // 소수부 끝의 0을 잘라내고, 만약 전부 0이었으면 정수부만 반환
  const nonZeroFrac = fracPart.replace(TRAILING_ZEROS_REGEX, '');
  let result: string;
  if (nonZeroFrac === '') {
    result = intPart;
  } else {
    result = `${intPart}.${nonZeroFrac}`;
  }

  return isNegative ? '-' + result : result;
}

/**
 * addStrings
 *  - 입력을 string | number 로 받아서 내부에서 String(a) → clean → BigInt 
 *    방식으로 더하거나 뺍니다.
 *  - 통화 기호, 콤마, 공백, 과학적 표기법(e/E) 처리를 모두 지원합니다.
 */
function addStrings(a: string | number, b: string | number): string {
  // 1) 문자열화 & 빈 문자열 검사
  let strA = String(a);
  let strB = String(b);
  if (!strA && !strB) return '0';
  if (!strA) return strB;
  if (!strB) return strA;

  // 2) clean( $,콤마,공백 제거 ) 및 '+' 부호 제거
  strA = strA.replace(CLEAN_REGEX, '').trim();
  strB = strB.replace(CLEAN_REGEX, '').trim();
  if (strA.startsWith('+')) strA = strA.slice(1);
  if (strB.startsWith('+')) strB = strB.slice(1);

  // 3) 잘못된 케이스( '-' 또는 '.' 만 있는 경우 등) → "0" 으로 처리
  if (!strA || strA === '-' || strA === '.') strA = '0';
  if (!strB || strB === '-' || strB === '.') strB = '0';

  // 4) 0인지 먼저 검사해서 조기 리턴
  const aIsZero = isZeroString(strA);
  const bIsZero = isZeroString(strB);
  if (aIsZero && bIsZero) return '0';
  if (aIsZero) {
    if (/e/i.test(strB)) {
      strB = convertScientificNotation(strB);
    }
    return strB;
  }
  if (bIsZero) {
    if (/e/i.test(strA)) {
      strA = convertScientificNotation(strA);
    }
    return strA;
  }

  // 5) 과학적 표기법(e/E) 처리
  if (/e/i.test(strA)) {
    strA = convertScientificNotation(strA);
  }
  if (/e/i.test(strB)) {
    strB = convertScientificNotation(strB);
  }

  // 6) 부호 분리
  const isNegativeA = strA.startsWith('-');
  const isNegativeB = strB.startsWith('-');
  if (isNegativeA) strA = strA.slice(1);
  if (isNegativeB) strB = strB.slice(1);

  // 7) 정수부/소수부 분리
  const [intA, fracA] = splitNumber(strA);
  const [intB, fracB] = splitNumber(strB);

  // 8) 소수부 길이를 동일하게 맞춤 (끝에 0 채우기)
  const maxFracLen = Math.max(fracA.length, fracB.length);
  const paddedFracA = fracA.padEnd(maxFracLen, '0');
  const paddedFracB = fracB.padEnd(maxFracLen, '0');

  // 9) BigInt 계산을 위해 "정수부 + 패딩된 소수부" 를 이어 붙여서 BigInt로 변환
  const numA = BigInt(intA + paddedFracA);
  const numB = BigInt(intB + paddedFracB);

  // 10) 부호에 따라 덧셈 or 뺄셈
  let resultBig: bigint;
  if (isNegativeA === isNegativeB) {
    // 같은 부호 → 덧셈
    resultBig = numA + numB;
    if (isNegativeA) resultBig = -resultBig;
  } else {
    // 부호 다름 → 뺄셈
    if (isNegativeA) {
      // (-A) + B  → B - A
      resultBig = numB - numA;
    } else {
      // A + (-B)  → A - B
      resultBig = numA - numB;
    }
  }

  // 11) BigInt 결과를 다시 "정수부.소수부" 형태로 포맷팅
  return formatResult(resultBig.toString(), maxFracLen);
}

// Helper function for reading cost data from API
async function readCostData(periods?: string[], vendor?: string): Promise<any | null> {
  try {
    const requestBody = {
      periods: periods || [],
      vendor: vendor || ''
    };

    console.error('Making cost API request:', {
      url: `${API_SERVER_URL}/api/v1/costs/info`,
      method: 'POST',
      body: requestBody
    });

    const response = await axios.post(`${API_SERVER_URL}/api/v1/costs/info`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'license-key': process.env.LICENSE_KEY || (() => { throw new Error('LICENSE_KEY environment variable is required') })()
      },
      httpsAgent: new https.Agent(HTTPS_AGENT_CONFIG)
    });

    if (response.status !== 200) {
      console.error('Cost API error response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      throw new Error(`HTTP error! status: ${response.status}, response: ${JSON.stringify(response.data)}`);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching cost data from API:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
    return null;
  }
}

// Helper function for reading usage data from API
async function readUsageData(prvrCd?: string, product?: string): Promise<any | null> {
  try {
    // Convert product key to API format
    let rsrcType = 'ec2'; // default value
    if (product && prvrCd && ASSET_PRODUCT_KEY_CONVERTER[prvrCd as keyof typeof ASSET_PRODUCT_KEY_CONVERTER]) {
      const vendorConverter = ASSET_PRODUCT_KEY_CONVERTER[prvrCd as keyof typeof ASSET_PRODUCT_KEY_CONVERTER];
      rsrcType = vendorConverter[product as keyof typeof vendorConverter] || 'ec2';
    }

    const requestBody = {
      rsrcType,
      prvrCd: prvrCd || 'aws'
    };

    const response = await axios.post(`${API_SERVER_URL}/api/v1/asset/usage`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'license-key': process.env.LICENSE_KEY || (() => { throw new Error('LICENSE_KEY environment variable is required') })()
      },
      httpsAgent: new https.Agent(HTTPS_AGENT_CONFIG)
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}, response: ${JSON.stringify(response.data)}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching usage data from API:", error);
    return null;
  }
}

// Create server instance
const server = new McpServer({
  name: "cloud-finops",
  version: "1.0.0",
});

// Cost tool
server.tool(
  "get-cost",
  "Get cloud cost summary for multiple vendors and months",
  {
    vendor: z.string().optional().describe("Cloud vendor name (e.g. 'AWS', 'Azure', 'GCP')"),
    months: z.array(z.string()).optional().describe("List of months in YYYY-MM format (e.g. ['2025-03', '2025-04'])"),
  },
  async ({ vendor, months }) => {
    const data = await readCostData(months, vendor);
    
    if (!data) {
      return {
        content: [
          { type: "text", text: "Failed to load cost data" }
        ],
      };
    }
    
    // Check if data has the expected structure
    if (!data.data || typeof data.data !== 'object') {
      return {
        content: [
          { type: "text", text: `Invalid data structure received: ${JSON.stringify(data)}` }
        ],
      };
    }
    
    const costData = data.data;
    const selectedVendors = vendor ? [vendor] : Object.keys(costData);
    
    // Accumulate response parts in an array to avoid repeated string concatenation
    const responseParts: string[] = [];
    
    for (const vendor of selectedVendors) {
      if (!costData[vendor]) continue;
      
      // Initialize summary data structures
      let totalCost = '0.00';
      const accountCosts: { [key: string]: string } = {};
      const regionCosts: { [key: string]: string } = {};
      
      const vendorMonths = costData[vendor];
      const selectedMonths = months && months.length > 0 ?
         Object.keys(vendorMonths).filter(m => months.includes(m)) :
         Object.keys(vendorMonths);
      
      // Build summary first
      let summaryText = `=== Summary Start ===\n`;
      summaryText += `Vendor: ${vendor}\n`;
      
      // Process data and build detailed text
      let detailedText = `=== Detailed Data Start ===\n`;
      for (const month of selectedMonths) {
        detailedText += `Month: ${month}\n`;
        const entries = vendorMonths[month];
        if (Array.isArray(entries) && entries.length > 0) {
          detailedText += `Cost|AccountID|Account|Product|Region\n`;
          for (const entry of entries) {
            const cost = entry.value || '0.00';
            totalCost = addStrings(totalCost, cost);
            
            // Sum by account
            if (!accountCosts[entry.account]) {
              accountCosts[entry.account] = '0.00';
            }
            accountCosts[entry.account] = addStrings(accountCosts[entry.account], cost);
            
            // Sum by region
            if (!regionCosts[entry.region]) {
              regionCosts[entry.region] = '0.00';
            }
            regionCosts[entry.region] = addStrings(regionCosts[entry.region], cost);
            
            detailedText += `$${cost}|${entry.accountId}|${entry.account}|${entry.product}|${entry.region}\n`;
          }
        } else {
          detailedText += `No cost data available\n`;
        }
        detailedText += `\n`;
      }
      detailedText += `=== Detailed Data End ===\n\n`;
      
      // Complete summary with calculated totals
      summaryText += `Total Cost: $${totalCost}\n\n`;
      
      summaryText += `Cost by Account:\n`;
      Object.entries(accountCosts)
        .sort(([,a], [,b]) => parseFloat(b) - parseFloat(a))
        .forEach(([account, cost]) => {
          summaryText += `${account}: $${cost}\n`;
        });
      summaryText += `\n`;
      
      summaryText += `Cost by Region:\n`;
      Object.entries(regionCosts)
        .sort(([,a], [,b]) => parseFloat(b) - parseFloat(a))
        .forEach(([region, cost]) => {
          summaryText += `${region}: $${cost}\n`;
        });
      summaryText += `=== Summary End ===\n\n`;
      
      // Combine summary and detailed text
      responseParts.push(summaryText, detailedText);
    }

    // Join all parts once
    let responseText = responseParts.join('\n');
    
    if (!responseText.trim()) {
      responseText = "No cost data found for the given parameters.";
    }
    
    console.error('Response text length:', responseText.length);
    
    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  }
);
// Usage tool
server.tool(
  "get-usage",
  "Get cloud usage summary for multiple vendors and products. Available products by vendor:\n" +
  "AWS: amazon_mq, ami, api_gateway_api_key, api_gateway_client_certificate, api_gateway_domain_name, api_gateway_rest_api, " +
  "api_gateway_usage_plan, api_gateway_vpc_link, auto_scaling_group, auto_scaling_instance, cloud_front, codedeploy_application, " +
  "codedeploy_deployment_group, direct_connect, dynamodb, ebs, ec2, ec2_ri, ecs_cluster, efs, eip, eks_cluster, elasticache, " +
  "elasticsearch_service, elb, eni, fsx, internet_gateway, ivs_channel, ivs_chat_room, kinesis_data_analytic, kinesis_data_firehose, " +
  "kinesis_data_stream, kinesis_video_stream, kms, lambda, launch_configuration, managed_workflows_for_apache_airflow, media_convert, " +
  "nat_gateway, network_acl, rds, rds_cluster, rds_ri, rds_snapshot, redshift, route53, route_table, s3, sagemaker_app, savings_plan, " +
  "security_group, snapshot, sqs, subnet, transit_gateway, vpc, vpc_endpoint, vpc_flow_log, workspace, workspace_bundle, workspace_directory, " +
  "workspace_image, workspace_ip_group\n" +
  "Azure: alert, application_gateway, application_insight, batch_account, cdn, cosmos_db, data_factory, ddos_protection_plan, disk, " +
  "image, load_balancer, local_network_gateway, log_analytics_workspace, managed_instance, mariadb_server, mssql_elastic_pool, " +
  "mssql_server, mssql_servers_database, mysql_database, mysql_flexible_server, mysql_server, namespace, network_interface, " +
  "network_security_group, network_watcher, postgresql_flexible_server, postgresql_server, public_ip_address, redis, route_table, " +
  "search_service, snapshot, storage_account, storage_accounts_blob, traffic_manager, vault, virtual_cluster, virtual_machine_scale_sets, " +
  "virtual_network, virtual_network_gateway, virtual_network_subnet, vm\n" +
  "GCP: autoscaler, bigquery_dataset, bigquery_table, bigtable_cluster, bigtable_instance, cloud_function, dataflow_job, " +
  "dataproc_cluster, disk, firewall, health_check, image, instance_group_manager, instance_groups, instance_template, ip_address, " +
  "kubernetes_cluster, pubsub_snapshot, pubsub_subscription, pubsub_topic, redis, route, snapshot, sql_instance, storage, subnet, " +
  "vm_instance, vpc_network, vpn_gateway, vpn_tunnel",
  {
    vendor: z.string().optional().describe("Cloud vendor name (e.g. 'AWS', 'Azure', 'GCP')"),
    product: z.string().optional().describe("Cloud product name (e.g. 'ec2' for AWS, 'vm' for Azure, 'vm_instance' for GCP)"),
  },
  async ({ vendor, product }) => {
    // Map vendor names to API codes
    const vendorMap: { [key: string]: string } = {
      'AWS': 'aws',
      'Azure': 'azu',
      'GCP': 'gcp'
    };

    if (!vendor || !vendorMap[vendor]) {
      return {
        content: [
          { type: "text", text: "Invalid vendor. Please specify one of: AWS, Azure, or GCP" }
        ],
      };
    }

    const prvrCd = vendorMap[vendor];
    const data = await readUsageData(prvrCd, product);
    
    if (!data) {
      return {
        content: [
          { type: "text", text: "Failed to load usage data" }
        ],
      };
    }

    let responseText = "";
    
    if (data.result && Array.isArray(data.result)) {
      for (const resultItem of data.result) {
        if (resultItem.option && resultItem.data) {
          responseText += `\n=== ${resultItem.option.label} ===\n`;
          if (resultItem.option.labelValue && resultItem.option.labelUnit) {
            responseText += `Total: ${resultItem.option.labelValue} ${resultItem.option.labelUnit}\n`;
          }
          
          if (Array.isArray(resultItem.data) && resultItem.data.length > 0) {
            for (const item of resultItem.data) {
              responseText += `${item.value}: ${item.cnt}\n`;
            }
          } else {
            responseText += `No data available\n`;
          }
          responseText += `\n`;
        }
      }
    }

    if (!responseText.trim()) {
      responseText = "No usage data found for the given parameters.";
    }

    console.error('Response text length:', responseText.length);

    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  }
);

// Start the server
async function main() {
  const args = process.argv.slice(2);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cloud FinOps MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

