import React, { FC } from 'react';
import styles from './Home.module.css';

// Bootstrap components
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

// Services
import UserService from '../../services/UserService';


interface HomeProps {}

const Home: FC<HomeProps> = () => {

  const createUser = () => {
    const users = UserService.prototype.getUsers();
    for (let i = 0; i < users.length; i++) {
      alert(users[i]);
    }
  }

  return (
    <Container className="p-0" fluid>
      <h1 className="p-3 bg-primary text-light m-0 text-center">
        Registro de usuarios con fotos
      </h1>

      <Form className="p-5">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>User photo</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={createUser}>
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default Home;
