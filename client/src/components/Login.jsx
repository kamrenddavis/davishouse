import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function Login() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    function handleSubmit(event) {

        event.preventDefault();
        console.log('Login attempted with:', {user});
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setUser(prevValue => {
        if (name === "username") {
            return {
            username: value,
            password: prevValue.password
            };
        } else if (name === "password") {
            return {
            username: user.username,
            password: value
            };
        }
        });
    }

    return (
        <div className="container">
            <Form onSubmit={handleSubmit}>
                <input
                    onChange={handleChange}
                    value={user.username}
                    name="username"
                    placeholder="Username/email"
                />
                <input
                    onChange={handleChange}
                    value={user.password}
                    name="password"
                    placeholder="Password"
                />
                <button>Submit</button>
            </Form>
        </div>
    );
}
