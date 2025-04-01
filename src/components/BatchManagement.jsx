import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Modal, 
  Form, 
  Select, 
  DatePicker, 
  Space,
  Tag 
} from 'antd';
import { 
  FilterOutlined, 
  EyeOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const BatchManagement = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const columns = [
    {
      title: 'Batch ID',
      dataIndex: 'batchId',
      key: 'batchId',
    },
    {
      title: 'Total Documents',
      dataIndex: 'totalDocuments',
      key: 'totalDocuments',
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
      },
      filters: [
        { text: 'Complete', value: 'Complete' },
        { text: 'Processing', value: 'Processing' },
        { text: 'Exceptions', value: 'Exceptions' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Exceptions',
      dataIndex: 'exceptions',
      key: 'exceptions',
      render: (exceptions) => exceptions > 0 ? 
        <Tag color="red">{exceptions} Exceptions</Tag> : 
        <Tag color="green">No Exceptions</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewBatch(record)}
          >
            View
          </Button>
          <Button 
            size="small" 
            icon={<FileTextOutlined />}
            type="primary"
          >
            Details
          </Button>
        </Space>
      )
    }
  ];

  const mockBatches = [
    {
      key: '1',
      batchId: 'B-2025-0142',
      totalDocuments: 32,
      status: 'Complete',
      startDate: '2025-01-15',
      endDate: '2025-01-16',
      exceptions: 0
    },
    {
      key: '2',
      batchId: 'B-2025-0141',
      totalDocuments: 18,
      status: 'Exceptions',
      startDate: '2025-01-10',
      endDate: '2025-01-12',
      exceptions: 4
    },
    {
      key: '3',
      batchId: 'B-2025-0140',
      totalDocuments: 45,
      status: 'Processing',
      startDate: '2025-01-08',
      endDate: '-',
      exceptions: 0
    },
    {
      key: '4',
      batchId: 'B-2025-0139',
      totalDocuments: 29,
      status: 'Complete',
      startDate: '2025-01-05',
      endDate: '2025-01-06',
      exceptions: 2
    }
  ];

  const handleFilterSubmit = (values) => {
    console.log('Filter values:', values);
    setIsFilterModalVisible(false);
  };

  const handleViewBatch = (batch) => {
    Modal.info({
      title: `Batch Details: ${batch.batchId}`,
      content: (
        <div>
          <p>Total Documents: {batch.totalDocuments}</p>
          <p>Status: {batch.status}</p>
          <p>Start Date: {batch.startDate}</p>
          <p>End Date: {batch.endDate}</p>
          <p>Exceptions: {batch.exceptions}</p>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <Card 
      title="Batch Management" 
      extra={
        <Button 
          icon={<FilterOutlined />} 
          onClick={() => setIsFilterModalVisible(true)}
        >
          Filters
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={mockBatches}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Filter Batches"
        visible={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleFilterSubmit}>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select batch status">
              <Option value="Complete">Complete</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Exceptions">Exceptions</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="Date Range">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BatchManagement;