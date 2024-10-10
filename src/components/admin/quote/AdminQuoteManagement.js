import React, { useState } from 'react';
import {Container, Tabs, Tab, Alert, Form} from 'react-bootstrap';
import UserQuoteList from '../../quote/UserQuoteList';
import QuoteRequestDetail from '../../quote/QuoteRequestDetail';

const AdminQuoteManagement = () => {
    const [selectedQuote, setSelectedQuote] = useState(null);

    const handleQuoteSelect = (quote) => {
        setSelectedQuote(quote);
    };

    return (
        <Container fluid>
            <h1 className="my-4">견적 요청 관리</h1>
            <Form.Text className="text-muted">
                Dev : Date & time list arragement implementation needed
            </Form.Text>
            <Tabs defaultActiveKey="list" id="admin-quote-management-tabs" className="mb-3">
                <Tab eventKey="list" title="견적 요청 목록">
                    {!selectedQuote ? (
                        <UserQuoteList onSelectQuote={handleQuoteSelect} />
                    ) : (
                        <Alert variant="info" onClose={() => setSelectedQuote(null)} dismissible>
                            견적 요청 상세 정보를 보려면 아래로 스크롤하세요.
                        </Alert>
                    )}
                </Tab>
                <Tab eventKey="statistics" title="통계">
                    {/* 여기에 견적 요청 통계 컴포넌트를 추가할 수 있습니다 */}
                    <p>견적 요청 통계 (개발 중)</p>
                </Tab>
            </Tabs>

            {selectedQuote && (
                <div className="mt-4">
                    <h2>견적 요청 상세</h2>
                    <QuoteRequestDetail quote={selectedQuote} isAdmin={true} />
                </div>
            )}
        </Container>
    );
};

export default AdminQuoteManagement;