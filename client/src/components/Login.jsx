import React, { useState } from 'react';
import Password from "./login/Password";
import Username from "./login/Username";
import Submit from "./login/Submit";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login attempted with:', { email, password });
        // Here you would typically send a request to your server
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div class="container">
                <Username />
                <Password />
                <Submit />
            </div>
        </Form>
    );
}
