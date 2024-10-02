import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import QuoteRequestForm from '../components/quote/QuoteRequestForm';
import UserQuoteList from '../components/quote/UserQuoteList';
import QuoteRequestCheck from '../components/quote/QuoteRequestCheck';

const UserQuoteManagement = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            setUser(JSON.parse(userJson));
        }
    }, []);

    const isAdmin = () => {
        return user && (user.role === 'ADMIN' || user.role === 'SUPER');
    };

    return (
        <Container>
            <h1 className="my-4">견적/문의</h1>
            <Tabs defaultActiveKey="new" id="quote-management-tabs" className="mb-3">
                <Tab eventKey="new" title="견적/문의 요청">
                    <QuoteRequestForm />
                </Tab>
                <Tab eventKey="check" title="요청 확인">
                    <QuoteRequestCheck />
                </Tab>
                {isAdmin() && (
                    <Tab eventKey="list" title="견적/문의 요청 목록">
                        <UserQuoteList />
                    </Tab>
                )}
            </Tabs>
        </Container>
    );
};

export default UserQuoteManagement;