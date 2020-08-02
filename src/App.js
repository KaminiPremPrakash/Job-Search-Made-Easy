
import React, { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import TableContainer from "./TableContainer"
import "bootstrap/dist/css/bootstrap.min.css";
import 'font-awesome/css/font-awesome.min.css';
import './App.css'
import * as ReactBootStrap from 'react-bootstrap';
import Modal from "react-modal";
import {
  Container,
  Card,
  CardText,
  CardBody,
  CardTitle,
} from "reactstrap"


const App = () => {
  const [data, setData] = useState([])
  const [formData, setformData] = useState({ "description": "", "location": "", "fulltime": false });
  const { register, handleSubmit } = useForm();
  const [isModalOpen, toggleModal] = useState(true);
  const [username, setUserName] = useState("");
  const [loading, setLoading] = useState(true)
  let pageNumber = 1;
  let url = "";

  useEffect(() => {
    let resData = [];
    let doFetch = async (count) => {
      url = `https://jobs.github.com/positions.json?description=${formData.description}&location=${formData.location}&full_time=${formData.fulltime}&page=${pageNumber}`;
      // console.log("counttttt  " + count)
      let response = [];
      let body = [];
      response = await fetch(url)
      body = await response.json();
      resData = resData.concat(body);
      //Call doFetch recursively till response data is <= 0
      if (body.length > 0) {
        pageNumber++;
        doFetch(count + 1);
      }
      setData(resData);
    }
    doFetch(1);
    setLoading(false);
  }, [url, formData]);


  const onSubmit = formData => {
    // console.log(formData);
    setLoading(true)
    setformData(formData);
  }

  const renderRowSubComponent = row => {
    const {
      company,
      company_logo,
      created_at,
      description,
      how_to_apply,
      location,
      title,
      type,

    } = row.original

    //to extract the href attribute value from json data
    let link = how_to_apply.match(/href="([^"]*?)"/)[1]
    return (
      <Card style={{ width: "40rem", margin: "0 auto" }}>
        <center><img src={company_logo} alt="Company logo" /></center>
        <CardBody>
          <CardTitle>
            <strong>{`${title}`} </strong>
          </CardTitle>
          <CardText>
            <strong>Company Name</strong>: {company} <br />
            <strong>Job Type</strong>: {type} <br />
            <strong>Job Created At</strong>: {created_at} <br />
            <strong>Location:</strong> {location}
            {/* dangerouslySetInnerHTML renders the description as JSX as description data contains html tags */}
            <strong>Description</strong><span dangerouslySetInnerHTML={{ __html: description }} /> <br />
            <button className="mybutton" ><a target="_blank" href={link} rel="noopener noreferrer" >Apply Here </a></button> <br />

          </CardText>
        </CardBody>
      </Card>
    )
  };

  const columns = useMemo(
    () => [

      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Company Name",
        accessor: "company",
      },
      {
        Header: "Location",
        accessor: "location",
        disableSortBy: true
      },
      {
        Header: "Job Created At",
        accessor: "created_at",
      },
      {
        Header: () => null,
        id: 'expander',
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <button className="btn btn-danger btn-sm">Close Details</button> : <button className="btn btn-info btn-sm">See Details</button>}
          </span>
        ),
      }
    ],
    []
  );

  return (
    <div>
      <center><h3>Welcome <span className="currentuser">{username}</span> </h3></center>
      <center><h3>You are one step away to find your dream job!!!!</h3></center>

      <Modal isOpen={isModalOpen} toggle={toggleModal} >
        <div className="mymodal">
          <form onSubmit={() => {
            setUserName(document.getElementById("myuser").value)
            toggleModal(false);

          }}>
            <h1>Hi! I am pleased you are here!</h1>
            <input id="myuser" type="text" name="username" placeholder="Enter your name here" ref={register} pattern="[A-Za-z\s]{3,}" title="Invalid name. Please use only letters (a-z or A-Z) and minimum 3 letters" required />
            <input style={{ marginLeft: 10 }} className="btn btn-dark" type="submit" value="Done" />
          </form>
        </div>
      </Modal>
      <Container style={{ marginTop: 50 }}>
        <div style={{ marginBottom: 20 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            Job Description:  <i className="fa fa-laptop icon myicon"></i><input name="description" style={{ marginRight: 10 }} placeholder=" Type here..." ref={register} pattern="[A-Za-z\s.()/]{3,}" title="Please use letters (a-z or A-Z), symbols ( . / () ) and minimum 3 letters" />
              Location : <i className="fa fa-globe icon myicon"></i><input name="location" placeholder="Location" ref={register} pattern="[A-Za-z\s]{2,}" title="Please use only letters (a-z or A-Z) and minimum 2 letters" />

            <input style={{ marginLeft: 10 }} type="checkbox" name="fulltime" value="yes" ref={register} /> Full Time Only

            <input style={{ marginLeft: 10 }} className="btn btn-dark" type="submit" value="Search" />
          </form>
        </div>
        {/* show preloader when the data is being fetched */}
        {
          loading ? <ReactBootStrap.Spinner style={{ position: "fixed", top: "50%", left: "50%" }} animation="border" /> : <TableContainer columns={columns} data={data} renderRowSubComponent={renderRowSubComponent} />
        }

      </Container>

    </div >
  )
}

export default App