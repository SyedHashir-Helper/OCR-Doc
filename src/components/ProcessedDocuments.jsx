import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Modal, 
  Form, 
  Select, 
  DatePicker, 
  Input,
  Tag 
} from 'antd';
import { 
  FilterOutlined, 
  FileSearchOutlined, 
  DownloadOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProcessedDocuments = () => {
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
      title: 'Processed Date',
      dataIndex: 'processedDate',
      key: 'processedDate',
    },
    {
      title: 'Batch ID',
      dataIndex: 'batchId',
      key: 'batchId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = {
          'Processed': 'green',
          'Verified': 'blue'
        }[status];
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button 
            size="small" 
            icon={<FileSearchOutlined />}
            onClick={() => handleViewDocument(record)}
            style={{ marginRight: 8 }}
          >
            View
          </Button>
          <Button 
            size="small" 
            icon={<DownloadOutlined />}
            type="primary"
          >
            Download
          </Button>
        </>
      )
    }
  ];

  const mockProcessedDocuments = [
    {
      key: '1',
      documentId: 'DOC-2025-0001',
      fileName: 'insurance_claim_001.pdf',
      type: 'Claim',
      processedDate: '2025-01-15',
      batchId: 'B-2025-0142',
      status: 'Processed'
    },
    {
      key: '2',
      documentId: 'DOC-2025-0002',
      fileName: 'agency_document_002.docx',
      type: 'Agency',
      processedDate: '2025-01-10',
      batchId: 'B-2025-0141',
      status: 'Verified'
    },
    {
      key: '3',
      documentId: 'DOC-2025-0003',
      fileName: 'mortgage_form_003.pdf',
      type: 'Mortgage',
      processedDate: '2025-01-08',
      batchId: 'B-2025-0140',
      status: 'Processed'
    },
    {
      key: '4',
      documentId: 'DOC-2025-0004',
      fileName: 'cancellation_request_004.pdf',
      type: 'Claim',
      processedDate: '2025-01-05',
      batchId: 'B-2025-0139',
      status: 'Verified'
    }
  ];

  const handleFilterSubmit = (values) => {
    console.log('Filter values:', values);
    setIsFilterModalVisible(false);
  };

  const handleViewDocument = (document) => {
    Modal.info({
      title: `Document Details: ${document.documentId}`,
      content: (
        <div>
          <p>File Name: {document.fileName}</p>
          <p>Type: {document.type}</p>
          <p>Processed Date: {document.processedDate}</p>
          <p>Batch ID: {document.batchId}</p>
          <p>Status: {document.status}</p>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <Card 
      title="Processed Documents" 
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
        dataSource={mockProcessedDocuments}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Filter Processed Documents"
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
          <Form.Item name="processedDateRange" label="Processed Date Range">
            <RangePicker />
          </Form.Item>
          <Form.Item name="documentId" label="Document ID">
            <Input placeholder="Enter Document ID" />
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

export default ProcessedDocuments;