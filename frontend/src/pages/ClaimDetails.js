import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Steps,
  Form,
  Input,
  Button,
  message,
  Timeline,
  Upload,
  Spin,
  Tag,
  Modal,
  Space
} from 'antd';
import { 
  UploadOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  MessageOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const { Step } = Steps;
const { TextArea } = Input;

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [form] = Form.useForm();
  const { user } = useAuth();

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const fetchClaim = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/claims/${id}`);
      setClaim(response.data);
      
      // Pre-fill form if there are existing answers
      if (response.data.answers && response.data.answers.length > 0) {
        const formValues = {};
        response.data.answers.forEach((ans, index) => {
          formValues[`q${index}`] = ans.answer;
        });
        form.setFieldsValue(formValues);
      }
    } catch (error) {
      console.error('Error fetching claim details:', error);
      message.error('Error fetching claim details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswers = async (values) => {
    setSubmitting(true);
    try {
      // Prepare answers array
      const answers = claim.itemId?.verificationQuestions?.map((q, index) => ({
        questionId: q._id || `q${index}`,
        question: q.question,
        answer: values[`q${index}`]
      })) || [];

      await api.put(`/claims/${id}/answers`, { answers });
      message.success('Answers submitted successfully! The item owner will review your answers.');
      fetchClaim();
    } catch (error) {
      console.error('Error submitting answers:', error);
      message.error(error.response?.data?.msg || 'Error submitting answers');
    }
    setSubmitting(false);
  };

  const handleClaimAction = async (action) => {
    Modal.confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Claim`,
      content: `Are you sure you want to ${action} this claim? This action cannot be undone.`,
      okText: `Yes, ${action}`,
      cancelText: 'Cancel',
      okButtonProps: { danger: action === 'reject' },
      onOk: async () => {
        try {
          await api.put(`/claims/${id}/${action}`);
          message.success(`Claim ${action}ed successfully!`);
          fetchClaim();
        } catch (error) {
          console.error(`Error ${action}ing claim:`, error);
          message.error(error.response?.data?.msg || `Error ${action}ing claim`);
        }
      }
    });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      message.warning('Please enter a message');
      return;
    }
    
    try {
      await api.post(`/claims/${id}/messages`, { message: messageText });
      setMessageText('');
      message.success('Message sent successfully');
      fetchClaim();
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Error sending message');
    }
  };

  const getStepStatus = (status) => {
    const steps = ['requested', 'awaiting_answers', 'answers_submitted', 'accepted'];
    const currentIndex = steps.indexOf(status);
    
    return currentIndex;
  };

  const getStatusColor = (status) => {
    const colors = {
      requested: 'blue',
      awaiting_answers: 'orange',
      answers_submitted: 'purple',
      accepted: 'green',
      rejected: 'red',
      cancelled: 'gray'
    };
    return colors[status] || 'default';
  };

  const isOwner = user && claim?.itemId?.userId?._id === user.id;
  const isClaimant = user && claim?.claimantId?._id === user.id;
  const canAnswerQuestions = isClaimant && claim?.status === 'awaiting_answers';
  const canReviewClaim = isOwner && claim?.status === 'answers_submitted';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading claim details..." />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="text-center py-12">
        <Card>
          <p className="text-gray-500">Claim not found</p>
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/dashboard')}
          type="link"
        >
          Back to Dashboard
        </Button>
      </div>

      <Card className="shadow-lg">
        {/* Title and Status */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Claim Review</h1>
            <p className="text-gray-600">
              for <span className="font-semibold">{claim.itemId?.title}</span>
            </p>
          </div>
          <Tag color={getStatusColor(claim.status)} className="text-base px-3 py-1">
            {claim.status.replace('_', ' ').toUpperCase()}
          </Tag>
        </div>

        {/* Progress Steps */}
        <Steps 
          current={getStepStatus(claim.status)} 
          className="mb-8"
          items={[
            { title: 'Requested', description: 'Claim initiated' },
            { title: 'Awaiting Answers', description: 'Questions ready' },
            { title: 'Answers Submitted', description: 'Waiting for review' },
            { title: 'Accepted', description: 'Item returned' }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Claim Info & Questions */}
          <div className="lg:col-span-2">
            {/* Item Information */}
            <Card title="Item Information" className="mb-4">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Item Title">
                  {claim.itemId?.title}
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  {claim.itemId?.category?.replace('_', ' ').toUpperCase()}
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {claim.itemId?.location}
                </Descriptions.Item>
                <Descriptions.Item label="Date Lost/Found">
                  {new Date(claim.itemId?.date).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {claim.itemId?.description}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Claim Information */}
            <Card title="Claim Information" className="mb-4">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Claimant">
                  {claim.claimantId?.name} ({claim.claimantId?.email})
                </Descriptions.Item>
                <Descriptions.Item label="Submitted On">
                  {new Date(claim.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {new Date(claim.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Questions & Answers Section */}
            <Card title="Verification Questions & Answers" className="mb-4">
              {claim.itemId?.verificationQuestions?.length > 0 ? (
                claim.itemId.verificationQuestions.map((q, index) => {
                  const answer = claim.answers?.find(a => a.question === q.question) || claim.answers?.[index];
                  return (
                    <div key={index} className="mb-4 pb-4 border-b last:border-0">
                      <p className="font-semibold text-gray-700 mb-2">{q.question}</p>
                      {answer ? (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-600">Answer: {answer.answer}</p>
                          {answer.evidence && (
                            <Button 
                              type="link" 
                              onClick={() => window.open(answer.evidence, '_blank')}
                              icon={<UploadOutlined />}
                              className="mt-2 p-0"
                            >
                              View Evidence
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Not answered yet</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center">No verification questions for this item</p>
              )}
            </Card>

            {/* Answer Form - Only for claimant when awaiting answers */}
            {canAnswerQuestions && (
              <Card 
                title="Verify Your Claim" 
                className="mb-4 border-blue-200 bg-blue-50"
              >
                <p className="text-gray-600 mb-4">
                  Please answer the following questions to verify that this item belongs to you.
                  The item owner will review your answers.
                </p>
                <Form
                  form={form}
                  onFinish={handleSubmitAnswers}
                  layout="vertical"
                >
                  {claim.itemId?.verificationQuestions?.map((q, index) => (
                    <Form.Item
                      key={index}
                      name={`q${index}`}
                      label={q.question}
                      rules={[{ required: true, message: 'Please answer this question' }]}
                    >
                      <TextArea 
                        rows={2} 
                        placeholder="Enter your answer here..."
                      />
                    </Form.Item>
                  ))}
                  
                  <Form.Item label="Upload Evidence (Optional)">
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>Upload Photo Evidence</Button>
                    </Upload>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload a photo that proves ownership (optional)
                    </p>
                  </Form.Item>

                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitting}
                    block
                    size="large"
                  >
                    Submit Answers
                  </Button>
                </Form>
              </Card>
            )}

            {/* Action Buttons - Only for owner when answers submitted */}
            {canReviewClaim && (
              <Card className="mb-4 border-green-200 bg-green-50">
                <h3 className="font-semibold text-lg mb-3">Review Claim</h3>
                <p className="text-gray-600 mb-4">
                  The claimant has submitted their answers. Review them and decide whether to accept or reject this claim.
                </p>
                <Space className="w-full justify-center">
                  <Button 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleClaimAction('accept')}
                    size="large"
                  >
                    Accept Claim
                  </Button>
                  <Button 
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleClaimAction('reject')}
                    size="large"
                  >
                    Reject Claim
                  </Button>
                </Space>
              </Card>
            )}

            {/* Status Messages */}
            {claim.status === 'accepted' && (
              <Card className="mb-4 border-green-200 bg-green-50">
                <div className="text-center">
                  <CheckCircleOutlined className="text-green-500 text-3xl mb-2" />
                  <p className="text-green-700 font-semibold">
                    This claim has been accepted! The item has been marked as returned.
                  </p>
                </div>
              </Card>
            )}

            {claim.status === 'rejected' && (
              <Card className="mb-4 border-red-200 bg-red-50">
                <div className="text-center">
                  <CloseCircleOutlined className="text-red-500 text-3xl mb-2" />
                  <p className="text-red-700 font-semibold">
                    This claim has been rejected.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Messages */}
          <div className="lg:col-span-1">
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <MessageOutlined />
                  <span>Messages</span>
                </div>
              }
              className="h-full sticky top-6"
              bodyStyle={{ height: '500px', display: 'flex', flexDirection: 'column', padding: '16px' }}
            >
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {claim.messages?.length > 0 ? (
                  claim.messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.senderId?._id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.senderId?._id === user?.id 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1">
                          {msg.senderId?._id === user?.id ? 'You' : msg.senderId?.name}
                        </p>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.senderId?._id === user?.id ? 'text-blue-100' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 mt-8">
                    <MessageOutlined className="text-3xl mb-2" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start a conversation about this claim</p>
                  </div>
                )}
              </div>

              {(isOwner || isClaimant) && claim.status !== 'accepted' && claim.status !== 'rejected' && (
                <div className="flex gap-2">
                  <Input.TextArea 
                    rows={2}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    onPressEnter={(e) => {
                      if (e.shiftKey) return;
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  />
                  <Button 
                    type="primary"
                    icon={<MessageOutlined />}
                    onClick={handleSendMessage}
                    className="h-auto"
                  >
                    Send
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClaimDetails;