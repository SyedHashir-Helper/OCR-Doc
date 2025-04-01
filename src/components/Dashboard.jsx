import React from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Tag, Upload } from 'antd';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { 
    InboxOutlined, 
    UploadOutlined, 
    FilterOutlined 
  } from '@ant-design/icons';
ChartJS.register(ArcElement, Tooltip, Legend);
const { Dragger } = Upload;

const Dashboard = () => {
    const uploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // Mock upload URL
        onChange(info) {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            setFileList(info.fileList);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
  // Sample data mirroring the dashboard image
  const documentTypeData = {
    labels: ['Claims', 'Agency Services', 'Mortgage Changes', 'Cancellations'],
    datasets: [{
      data: [42, 28, 18, 12],
      backgroundColor: ['#1890ff', '#ff4d4f', '#52c41a', '#faad14']
    }]
  };

  const batchColumns = [
    {
      title: 'Batch ID',
      dataIndex: 'batchId',
      key: 'batchId',
    },
    {
      title: 'Documents',
      dataIndex: 'documents',
      key: 'documents',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = {
          'Complete': 'green',
          'Processing': 'orange',
          'Exceptions': 'red'
        }[status];
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <a>View</a>
    }
  ];

  const batchData = [
    { key: '1', batchId: 'B-2025-0142', documents: 32, status: 'Complete' },
    { key: '2', batchId: 'B-2025-0141', documents: 18, status: 'Exceptions' },
    { key: '3', batchId: 'B-2025-0140', documents: 45, status: 'Processing' },
    { key: '4', batchId: 'B-2025-0139', documents: 29, status: 'Complete' }
  ];

  const exceptionsColumns = [
    {
      title: 'Document ID',
      dataIndex: 'docId',
      key: 'docId',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Issue',
      dataIndex: 'issue',
      key: 'issue',
    }
  ];

  const exceptionsData = [
    { key: '1', docId: 'DOC-8432', type: 'Claim', issue: 'Missing Policy #' },
    { key: '2', docId: 'DOC-8446', type: 'Agency', issue: 'Amount Mismatch' },
    { key: '3', docId: 'DOC-8451', type: 'Mortgage', issue: 'Unclear Scan' },
    { key: '4', docId: 'DOC-8455', type: 'Claim', issue: 'Invalid Date' }
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Documents Today" value={124} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Processing Rate" value="85%" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Pending Exceptions" value={18} valueStyle={{ color: 'red' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Active Batches" value={5} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* <Col span={12}>
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                sensitive files
                </p>
            </Dragger>
        </Col> */}
        <Col span={24}>
          <Card title="Recent Batches">
            <Table 
              columns={batchColumns} 
              dataSource={batchData} 
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={12}>
          <Card title="Document Type Analysis">
            <Row>
              <Col span={12}>
                <Pie data={documentTypeData} />
              </Col>
              <Col span={12}>
                <div>
                  <div>Claims: 42%</div>
                  <div>Agency Services: 28%</div>
                  <div>Mortgage Changes: 18%</div>
                  <div>Cancellations: 12%</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Recent Exceptions">
            <Table 
              columns={exceptionsColumns} 
              dataSource={exceptionsData} 
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;