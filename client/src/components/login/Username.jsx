import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function Username() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </Form.Group>
    );
}
