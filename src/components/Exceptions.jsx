import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Tag,
  Space,
  message,
  Input
} from 'antd';
import {
  FilterOutlined,
  ExceptionOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ResolveExceptionModal = ({
  currentException,
  isResolveModalVisible,
  setIsResolveModalVisible,
  documentFields,
  onSubmit
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      resolutionDetails: currentException?.resolutionDetails || '',
      ...Object.fromEntries(documentFields.map(f => [f.name, f.value]))
    }
  });

  const handleResolveSubmit = async (data, documentId) => {
    try {
      const { resolutionDetails, ...fieldValues } = data;  
      // Update the document using your new API endpoint format
      const response = await axios.put(`http://localhost:3000/api/update_document`, {
        document_id: currentException.documentId,
        document_type: currentException.type.toLowerCase(), // Make sure type is lowercase to match backend
        fields: fieldValues
      });
  
      message.success('Exception resolved and document updated successfully!');
      setIsResolveModalVisible(false);
      fetchExceptions();
    } catch (err) {
      console.error(err);
      message.error('Failed to resolve and update document.');
    }
  };

  return (
    <Modal
      title={`Resolve Exception - Document ID: ${currentException?.documentId}`}
      open={isResolveModalVisible}
      onCancel={() => setIsResolveModalVisible(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit((data)=> handleResolveSubmit(data, currentException?.documentId))}>
        <div style={{ marginBottom: 16 }}>
          <label> Resolution Details</label>
          <Controller
            name="resolutionDetails"
            control={control}
            rules={{ required: "Please input resolution details" }}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={4}
                status={errors.resolutionDetails ? "error" : ""}
              />
            )}
          />
          {errors.resolutionDetails && (
            <p style={{ color: "red" }}>{errors.resolutionDetails.message}</p>
          )}
        </div>

        {documentFields.map((field) => (
          <div key={field.name} style={{ marginBottom: 16 }}>
            <label><b>{field.name}</b> - {field.value? field.value : "Empty"}</label>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <Input {...controllerField}  />
              )}
            />
          </div>
        ))}

        <Button type="primary" htmlType="submit">
          Resolve & Update
        </Button>
      </form>
    </Modal>
  );
};

const Exceptions = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterForm] = Form.useForm();
  const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
  const [currentException, setCurrentException] = useState(null);
  const [documentFields, setDocumentFields] = useState([]);

  useEffect(() => {
    fetchExceptions();
  }, []);

  const fetchExceptions = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/exceptions`);
      const raw = response.data.exceptions;

      const formatted = raw.map((item, index) => ({
        key: index,
        documentId: item[0],
        fileName: item[1],
        type: item[2],
        exceptionType: item[3],
        batchId: item[4],
        dateIdentified: item[5],
      }));

      setExceptions(formatted);
    } catch (error) {
      console.error('Error fetching exceptions:', error);
      message.error('Failed to load exceptions data');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveException = async (exceptionKey) => {
    try {
      const exception = exceptions[exceptionKey];
      const docId = exception.documentId;
      const docType = exception.type;

      const response = await axios.post(`http://localhost:3000/api/exceptions_details`, {
        document_id: docId
      });
      const data = response.data;

      const dynamicFields = Object.entries(data.type_specific_data || {}).map(([key, value]) => ({
        name: key,
        value: value
      }));

      setDocumentFields(dynamicFields);

      setCurrentException({
        documentId: docId,
        exceptionId: data.exceptionId,
        type: docType,
        resolutionDetails: data.resolutionDetails || '',
      });

      setIsResolveModalVisible(true);
    } catch (error) {
      console.error('Error fetching exception data:', error);
      message.error('Failed to fetch exception details');
    }
  };

  const handleResolveSubmit = async (data) => {
    try {
      const { resolutionDetails, ...fieldValues } = values;

      await axios.post(`http://localhost:3000/api/exceptions/resolve`, {
        exceptionId: currentException.exceptionId,
        resolutionDetails
      });

      await axios.post(`http://localhost:3000/api/documents/update`, {
        documentId: currentException.documentId,
        type: currentException.type,
        fields: fieldValues
      });

      message.success('Exception resolved and document updated successfully!');
      setIsResolveModalVisible(false);
      fetchExceptions();
    } catch (err) {
      console.error(err);
      message.error('Failed to resolve and update document.');
    }
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
      onOk() { },
    });
  };

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
            onClick={() => handleResolveException(record.key)}
          >
            Resolve
          </Button>
        </Space>
      )
    }
  ];

  const handleFilterSubmit = (values) => {
    fetchExceptions(values);
    setIsFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    filterForm.resetFields();
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
        dataSource={exceptions}
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <ResolveExceptionModal
        currentException={currentException}
        isResolveModalVisible={isResolveModalVisible}
        setIsResolveModalVisible={setIsResolveModalVisible}
        documentFields={documentFields}
        onSubmit={handleResolveSubmit}
      />

      <Modal
        title="Filter Exceptions"
        open={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
      >
        <Form
          form={filterForm}
          onFinish={handleFilterSubmit}
          layout="vertical"
        >
          <Form.Item name="documentType" label="Document Type">
            <Select placeholder="Select document type" allowClear>
              <Option value="Claim">Claim</Option>
              <Option value="Agency">Agency</Option>
              <Option value="Mortgage">Mortgage</Option>
            </Select>
          </Form.Item>
          <Form.Item name="exceptionType" label="Exception Type">
            <Select placeholder="Select exception type" allowClear>
              <Option value="Missing Data">Missing Data</Option>
              <Option value="Validation Error">Validation Error</Option>
              <Option value="Format Issue">Format Issue</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateIdentifiedRange" label="Date Identified Range">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Apply Filters
              </Button>
              <Button onClick={handleResetFilters}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Exceptions;
