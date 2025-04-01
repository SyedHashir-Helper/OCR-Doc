import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Modal, 
  Form, 
  Select, 
  DatePicker, 
  Tag,
  Space 
} from 'antd';
import { 
  FilterOutlined, 
  ExceptionOutlined, 
  FileProtectOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Exceptions = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const columns = [
    {
      title: 'Document ID',
      dataIndex: 'documentId',
      key: 'documentId',
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Claim', value: 'Claim' },
        { text: 'Agency', value: 'Agency' },
        { text: 'Mortgage', value: 'Mortgage' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Exception Type',
      dataIndex: 'exceptionType',
      key: 'exceptionType',
      render: (exceptionType) => {
        const color = {
          'Missing Data': 'orange',
          'Validation Error': 'red',
          'Format Issue': 'volcano'
        }[exceptionType];
        return <Tag color={color}>{exceptionType}</Tag>;
      }
    },
    {
      title: 'Batch ID',
      dataIndex: 'batchId',
      key: 'batchId',
    },
    {
      title: 'Date Identified',
      dataIndex: 'dateIdentified',
      key: 'dateIdentified',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<ExceptionOutlined />}
            onClick={() => handleViewException(record)}
          >
            Details
          </Button>
          <Button 
            size="small" 
            icon={<FileProtectOutlined />}
            type="primary"
          >
            Resolve
          </Button>
        </Space>
      )
    }
  ];

  const mockExceptions = [
    {
      key: '1',
      documentId: 'DOC-8432',
      fileName: 'insurance_claim_001.pdf',
      type: 'Claim',
      exceptionType: 'Missing Data',
      batchId: 'B-2025-0142',
      dateIdentified: '2025-01-15'
    },
    {
      key: '2',
      documentId: 'DOC-8446',
      fileName: 'agency_document_002.docx',
      type: 'Agency',
      exceptionType: 'Validation Error',
      batchId: 'B-2025-0141',
      dateIdentified: '2025-01-10'
    },
    {
      key: '3',
      documentId: 'DOC-8451',
      fileName: 'mortgage_form_003.pdf',
      type: 'Mortgage',
      exceptionType: 'Format Issue',
      batchId: 'B-2025-0140',
      dateIdentified: '2025-01-08'
    },
    {
      key: '4',
      documentId: 'DOC-8455',
      fileName: 'cancellation_request_004.pdf',
      type: 'Claim',
      exceptionType: 'Missing Data',
      batchId: 'B-2025-0139',
      dateIdentified: '2025-01-05'
    }
  ];

  const handleFilterSubmit = (values) => {
    console.log('Filter values:', values);
    setIsFilterModalVisible(false);
  };

  const handleViewException = (exception) => {
    Modal.info({
      title: `Exception Details: ${exception.documentId}`,
      content: (
        <div>
          <p>File Name: {exception.fileName}</p>
          <p>Document Type: {exception.type}</p>
          <p>Exception Type: {exception.exceptionType}</p>
          <p>Batch ID: {exception.batchId}</p>
          <p>Date Identified: {exception.dateIdentified}</p>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <Card 
      title="Exceptions" 
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
        dataSource={mockExceptions}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Filter Exceptions"
        visible={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleFilterSubmit}>
          <Form.Item name="documentType" label="Document Type">
            <Select placeholder="Select document type">
              <Option value="Claim">Claim</Option>
              <Option value="Agency">Agency</Option>
              <Option value="Mortgage">Mortgage</Option>
            </Select>
          </Form.Item>
          <Form.Item name="exceptionType" label="Exception Type">
            <Select placeholder="Select exception type">
              <Option value="Missing Data">Missing Data</Option>
              <Option value="Validation Error">Validation Error</Option>
              <Option value="Format Issue">Format Issue</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateIdentifiedRange" label="Date Identified Range">
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

export default Exceptions;