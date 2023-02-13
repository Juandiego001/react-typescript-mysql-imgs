import React, { useState, FC, useEffect } from 'react';
import styles from './Home.module.css';

// Bootstrap components
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

// Services
import UserService from '../../services/UserService';

interface HomeProps { }

const Home: FC<HomeProps> = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<File>();
  const [theUsers, setTheUsers] = useState([]);

  function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setPhoto(e.target.files[0]);
  }

  function handleTheUsers() {
    let allUsers: any = [...theUsers];
    let theFile = photo;
    
    if (theFile) {
      let suffix_photo = theFile.name.split(".")[1];
      allUsers.push({
        "email": email,
        "password": password,
        "user_photo": 1,
        "suffix_photo": suffix_photo
      })
    } else {
      allUsers.push({
        "email": email,
        "password": password,
        "user_photo": 0
      })
    }

    setTheUsers(allUsers);
  }

  async function createUser(e: React.MouseEvent<HTMLButtonElement>) {
    await UserService.postUsers({
      email,
      password,
      "user_photo": photo
    })
      .then((res: any) => {
        let codeRes = res["code"];

        if (codeRes == 200) {
          alert("¡El usuario ha sido creado con éxito!");
          handleTheUsers();
        } else {
          alert("No se logró crear el usuario");
        }
      })
      .catch(err => {
        console.log("err");
        console.log(err);
      })
  }

  useEffect(() => {
    UserService.getUsers()
      .then((res: any) => {
        setTheUsers(res.data);
      })
      .catch(err => {
        console.log("err");
        console.log(err);
      })
  }, [])

  return (
    <Container className="p-0" fluid>
      <h1 className="p-3 bg-primary text-light m-0 text-center">
        Registro de usuarios con fotos
      </h1>

      <Form className="pt-5 px-5">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleEmail} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={handlePassword} />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>User photo</Form.Label>
          <Form.Control type="file" onChange={handlePhoto} />
        </Form.Group>
      </Form>

      <Button className="ms-5" variant="primary" onClick={createUser}>
        Register
      </Button>

      {
        theUsers.length > 0 ?
          <div className="px-5 mt-2 mb-5 container-fluid m-0 p-0 g-0 tex-center">
            <h2 className="text-center mt-2 mb-5">Tabla de usuarios</h2>
            {
              theUsers.map((i, e) => {
                return (
                  <div key={"users" + e} className="row m-0 p-0 g-0 bg-light justify-content-center border border-dark">
                    <div className="col-4 d-flex justify-content-center align-items-center text-center">
                      {
                        i["user_photo"] == 1 ?
                          <img width="100%" src={"/userImages/" + i["email"]  + "." + i["suffix_photo"]} />
                        :
                          <p className="m-0 p-0">No photo</p>
                      }
                    </div>
                    <div className="col-4 d-flex justify-content-center align-items-center text-center">
                      <p className="m-0 p-0">{i["email"]}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-center align-items-center text-center">
                      <p className="m-0 p-0">{i["password"]}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
          :
          <p className="ms-5 mt-4">No hay usuarios registrados en la base de datos.</p>
      }

    </Container>
  );
}

export default Home;
