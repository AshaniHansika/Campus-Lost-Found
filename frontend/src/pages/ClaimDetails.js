import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Modal
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Step } = Steps;

const ClaimDetails = () => {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const fetchClaim = async () => {
    try {
      const response = await axios.get(`/api/claims/${id}`);
      setClaim(response.data);
      
      // Pre-fill answers if they exist
      if (response.data.answers) {
        setAnswers(response.data.answers);
      }
    } catch (error) {
      message.error('Error fetching claim details');
    }
  };

  const handleSubmitAnswers = async (values) => {
    setLoading(true);
    try {
      const answerData = Object.keys(values).map(key => ({
        questionId: key,
        answer: values[key]
      }));

      await axios.put(`/api/claims/${id}/answers`, { answers: answerData });
      message.success('Answers submitted successfully');
      fetchClaim();
    } catch (error) {
      message.error('Error submitting answers');
    }
    setLoading(false);
  };

  const handleClaimAction = async (action) => {
    try {
      await axios.put(`/api/claims/${id}/${action}`);
      message.success(`Claim ${action}ed successfully`);
      fetchClaim();
    } catch (error) {
      message.error(`Error ${action}ing claim`);
    }
  };

  if (!claim) return <div>Loading...</div>;

  const getStepStatus = (status) => {
    const steps = ['requested', 'awaiting_answers', 'answers_submitted', 'accepted'];
    const currentIndex = steps.indexOf(status);
    return (stepIndex) => {
      if (stepIndex < currentIndex) return 'finish';
      if (stepIndex === currentIndex) return 'process';
      return 'wait';
    };
  };

  return (
    <div className="p-6">
      <Card title="Claim Verification Process">
        <Steps current={getStepStatus(claim.status)} className="mb-8">
          <Step title="Requested" description="Claim initiated" />
          <Step title="Awaiting Answers" description="Questions ready" />
          <Step title="Answers Submitted" description="Waiting for review" />
          <Step title="Accepted" description="Item returned" />
        </Steps>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Descriptions title="Claim Information" bordered column={1}>
              <Descriptions.Item label="Status">
                {claim.status}
              </Descriptions.Item>
              <Descriptions.Item label="Claimant">
                {claim.claimantId?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Submitted">
                {new Date(claim.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {claim.status === 'awaiting_answers' && (
              <Card title="Answer Verification Questions" className="mt-4">
                <Form form={form} onFinish={handleSubmitAnswers}>
                  {claim.itemId?.verificationQuestions?.map((q, index) => (
                    <Form.Item
                      key={index}
                      name={`q${index}`}
                      label={q.question}
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea rows={2} />
                    </Form.Item>
                  ))}
                  
                  <Form.Item name="evidence" label="Evidence (Optional)">
                    <Upload>
                      <Button icon={<UploadOutlined />}>Upload Photo</Button>
                    </Upload>
                  </Form.Item>

                  <Button type="primary" htmlType="submit" loading={loading}>
                    Submit Answers
                  </Button>
                </Form>
              </Card>
            )}

            {claim.status === 'answers_submitted' && (
              <div className="mt-4 space-x-2">
                <Button 
                  type="primary" 
                  onClick={() => handleClaimAction('accept')}
                >
                  Accept Claim
                </Button>
                <Button 
                  danger 
                  onClick={() => handleClaimAction('reject')}
                >
                  Reject Claim
                </Button>
                <Button onClick={() => handleClaimAction('request-more-info')}>
                  Request More Info
                </Button>
              </div>
            )}
          </div>

          <div>
            <Card title="Messages">
              <Timeline>
                {claim.messages?.map((msg, index) => (
                  <Timeline.Item key={index}>
                    <p className="font-bold">{msg.senderId?.name}</p>
                    <p>{msg.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </Timeline.Item>
                ))}
              </Timeline>
              
              <Form className="mt-4">
                <Form.Item>
                  <Input.TextArea rows={2} placeholder="Type a message..." />
                </Form.Item>
                <Button type="primary">Send</Button>
              </Form>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClaimDetails;