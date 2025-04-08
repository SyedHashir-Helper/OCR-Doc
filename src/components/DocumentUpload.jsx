import { useState, useEffect } from "react"
import {
  Upload,
  message,
  Table,
  Card,
  Button,
  Modal,
  Form,
  Select,
  Space,
  Spin,
  Typography,
  Descriptions,
  List,
} from "antd"
import { InboxOutlined, FilterOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import axios from "axios"

const { Dragger } = Upload
const { Option } = Select
const { Title, Text } = Typography

const DocumentUpload = () => {
  const [documents, setDocuments] = useState([])
  const [fileList, setFileList] = useState([])
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [responseModalVisible, setResponseModalVisible] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/get_docs")
        const rawData = response.data

        // Transform the nested arrays into objects
        const formattedDocs = rawData.map((row) => ({
          id: row[0],
          doc_name: row[1],
          batch_name: row[2],
          type_name: row[3],
          status: row[4],
          created_at: row[5],
        }))

        setDocuments(formattedDocs)
        console.log(documents)
      } catch (error) {
        console.error("Error fetching documents:", error)
        message.error("Failed to fetch documents from backend")
      }
    }

    fetchDocuments()
  }, [])

  const handleUpload = (info) => {
    // Store the complete file objects instead of just the paths
    const newFileList = info.fileList
    setFileList(newFileList)
    console.log("Updated file list:", newFileList)
  }

  const handleSubmit = async () => {
    try {
      // Set loading state to true
      setIsLoading(true)

      // Extract files or file paths as needed for your backend
      const files = fileList.map((file) => file.originFileObj)

      console.log("Sending files to backend:", files)

      // Create FormData for file upload
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await axios.post("http://127.0.0.1:3000/api/process_docs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log(response.data)

      // Ensure the response data has the expected structure with proper defaults
      const processedResponse = {
        status_code: response.data.status_code || 500,
        message: response.data.message || "No response message",
        total_check_amount: response.data.total_check_amount || "0.00",
        successful_docs: response.data.successful_docs,
        exception_docs: response.data.exception_docs,
        exceptions: Array.isArray(response.data.exceptions) ? response.data.exceptions : [],
      }

      // Store the processed API response
      setApiResponse(processedResponse)

      // Show the response modal
      setResponseModalVisible(true)

      // Clear the file list after successful upload
      setFileList([])

      message.success("Files processed successfully")
    } catch (error) {
      console.error("Upload error:", error)
      message.error("Failed to send files to backend")
    } finally {
      // Set loading state to false regardless of success or failure
      setIsLoading(false)
    }
  }

  const columns = [
    {
      title: "Document Name",
      dataIndex: "doc_name",
      key: "doc_name",
    },
    {
      title: "Batch",
      dataIndex: "batch_name",
      key: "batch_name",
    },
    {
      title: "Type",
      dataIndex: "type_name",
      key: "type_name",
      filters: [
        { text: "Claim", value: "Claim" },
        { text: "Agency", value: "Agency" },
        { text: "Check", value: "Check" },
      ],
      onFilter: (value, record) => record.type.includes(value),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = {
          Uploaded: "blue",
          Processing: "orange",
          Completed: "green",
          Failed: "red",
          pending: "gray",
        }[status]
        return <span style={{ color }}>{status}</span>
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button size="small">View</Button>
          <Button size="small" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  // Combine mock documents with uploaded files
  const tableData = [
    ...documents.map((doc) => ({
      key: doc.id,
      ...doc,
    })),
  ]

  const handleFilterSubmit = (values) => {
    console.log("Filter values:", values)
    setIsFilterModalVisible(false)
  }

  const closeResponseModal = () => {
    setResponseModalVisible(false)
    setApiResponse(null)
  }

  return (
    <Card title="Document Upload">
      <Spin spinning={isLoading} tip="Processing documents...">
        <Dragger beforeUpload={() => false} onChange={handleUpload} multiple fileList={fileList} disabled={isLoading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag files to upload</p>
        </Dragger>
        <Button
          onClick={handleSubmit}
          type="primary"
          style={{ marginTop: 16 }}
          disabled={fileList.length === 0 || isLoading}
          loading={isLoading}
        >
          Send to Backend
        </Button>

        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Button icon={<FilterOutlined />} onClick={() => setIsFilterModalVisible(true)} disabled={isLoading}>
            Filters
          </Button>
        </div>

        <Table columns={columns} dataSource={tableData} pagination={{ pageSize: 5 }} loading={isLoading} />
      </Spin>

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

      {/* Response Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            {apiResponse?.status_code === 200 ? (
              <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
            ) : (
              <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
            )}
            <span>Document Processing Result</span>
          </div>
        }
        visible={responseModalVisible}
        onCancel={closeResponseModal}
        footer={[
          <Button key="close" type="primary" onClick={closeResponseModal}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {apiResponse && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Status">
                <Text type={apiResponse.status_code === 200 ? "success" : "danger"}>{apiResponse.message}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Total Check Amount">${apiResponse.total_check_amount}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
             <Text type="success">Successful: {apiResponse.successful_docs}</Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text type="danger">Exceptions: {apiResponse.exceptions.length}</Text>
            </div>

            {apiResponse?.exceptions && Array.isArray(apiResponse.exceptions) && apiResponse.exceptions.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Exceptions</Title>
                <List
                  size="small"
                  bordered
                  dataSource={apiResponse.exceptions}
                  renderItem={(item) => (
                    <List.Item>
                      <Text type="danger">{item}</Text>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default DocumentUpload
