import React, { useState, useRef } from 'react';
import { 
  Upload, 
  message, 
  Table, 
  Card, 
  Button, 
  Modal, 
  Form, 
  Select, 
  Input, 
  Space 
} from 'antd';
import { 
  InboxOutlined, 
  UploadOutlined, 
  FilterOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Option } = Select;

const DocumentUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const handleUpload = (info) => {
    // Store the complete file objects instead of just the paths
    const newFileList = info.fileList;
    setFileList(newFileList);
    console.log('Updated file list:', newFileList);
  };

  const handleSubmit = async () => {
    try {
      // Extract files or file paths as needed for your backend
      const files = fileList.map(file => file.originFileObj);
      
      console.log('Sending files to backend:', files);
      
      // Create FormData for file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await axios.post('http://127.0.0.1:3000/api/process_docs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data)
      
      message.success('Files sent to backend successfully');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to send files to backend');
    }
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
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
      onFilter: (value, record) => record.type.includes(value),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${(size / 1024).toFixed(2)} KB`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = {
          'Uploaded': 'blue',
          'Processing': 'orange',
          'Completed': 'green',
          'Failed': 'red'
        }[status];
        return <span style={{ color }}>{status}</span>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">View</Button>
          <Button size="small" danger>Delete</Button>
        </Space>
      )
    }
  ];

  const mockDocuments = [
    {
      key: '1',
      name: 'insurance_claim_001.pdf',
      type: 'Claim',
      size: 1024 * 250,
      status: 'Completed'
    },
    {
      key: '2',
      name: 'agency_document_002.docx',
      type: 'Agency',
      size: 1024 * 150,
      status: 'Processing'
    },
    {
      key: '3',
      name: 'mortgage_form_003.pdf',
      type: 'Mortgage',
      size: 1024 * 300,
      status: 'Uploaded'
    },
    {
      key: '4',
      name: 'cancellation_request_004.pdf',
      type: 'Claim',
      size: 1024 * 100,
      status: 'Failed'
    }
  ];

  // Combine mock documents with uploaded files
  const tableData = [
    ...mockDocuments,
    ...fileList.map((file, index) => ({
      key: `uploaded-${index}`,
      name: file.name,
      type: 'Uploaded',
      size: file.size || 0,
      status: 'Uploaded'
    }))
  ];

  const handleFilterSubmit = (values) => {
    console.log('Filter values:', values);
    setIsFilterModalVisible(false);
  };

  return (
    <Card title="Document Upload">
      <Dragger 
        beforeUpload={() => false} 
        onChange={handleUpload} 
        multiple
        fileList={fileList}
      >
        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        <p className="ant-upload-text">Click or drag files to upload</p>
      </Dragger>
      <Button 
        onClick={handleSubmit} 
        type="primary" 
        style={{ marginTop: 16 }}
        disabled={fileList.length === 0}
      >
        Send to Backend
      </Button>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <Button 
          icon={<FilterOutlined />} 
          onClick={() => setIsFilterModalVisible(true)}
        >
          Filters
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={tableData}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Filter Documents"
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
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Option value="Uploaded">Uploaded</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Failed">Failed</Option>
            </Select>
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

export default DocumentUpload;
