import React, { Component } from 'react';

import Modal from "./modal"
import more from "./assets/more.png"

class EmployeeHome extends Component {
  constructor(props){
    super(props);
    this.state = {
      showDetailModal: false
    }
    this.closeModal =  this.closeModal.bind(this);
    this.employeeDetailData =  "";
  }

  componentDidMount() {
    this.fetchData().then((data)=>{
      if(!localStorage.getItem("employee_data"))
        localStorage.setItem("employee_data", JSON.stringify(data))
    })
  }


  async fetchData() {
    let response = await fetch(`http://demo8323138.mockable.io/employees`);
    let data = await response.json()
    return data[0];
  }

  showDetailModal(data) {
    this.setState({
      showDetailModal: true
    })
    this.employeeDetailData = data;
  }

  closeModal(data) {
    this.setState({
      showDetailModal: false
    })
  }


  render() {
    const employeeData = JSON.parse(localStorage.getItem("employee_data"));
    return (
      <div className="employee-home-wrap">
        <h1>Employees <button>Create Employee</button></h1>
        <table className="ea_table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fullname</th>
              <th>Employee Code</th>
              <th>Job Title</th>
              <th>Phone Number</th>
              <th>Email ID</th>
              <th>Region</th>
              <th>DOB</th>
            </tr>
          </thead>
          <tbody>
            
              {
                employeeData && employeeData.length>0 && employeeData.map((employee) => {
                  return(
                    <tr>
                      <td>{employee.id}</td>
                      <td>{employee.preferredFullName}</td>
                      <td>{employee.employeeCode}</td>
                      <td>{employee.jobTitleName}</td>
                      <td>{employee.phoneNumber}</td>
                      <td>{employee.emailAddress}</td>
                      <td>{employee.region}</td>
                      <td>
                        {employee.dob} 
                        <div className="icon-wrap">
                          <img src={more} />
                          <div className="tool-tip">
                            <span onClick={()=> this.showDetailModal(employee)}>View</span>
                            <span>Edit</span>
                            <span>Delete</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            
          </tbody>
        </table>

        <Modal
          className="employee-detail-modal"
          visible={this.state.showDetailModal}
          animation="fadeIn"
          onClose={this.closeModal}
        >
          <span className="employee-code">123123</span>
          <h2 className="employee-name">{this.employeeDetailData.preferredFullName}</h2>
          <hr></hr>
          <div className="details-wrap">
            <div className="left-wrap">
              <span>Name</span>
              <span>Employee Code</span>
              <span>Job Title</span>
              <span>Phone Number</span>
              <span>Email ID</span>
              <span>Region</span>
              <span>DOB</span>
            </div>
            <div className="right-wrap">
              <span>{this.employeeDetailData.preferredFullName}</span>
              <span>{this.employeeDetailData.employeeCode}</span>
              <span>{this.employeeDetailData.jobTitleName}</span>
              <span>{this.employeeDetailData.phoneNumber}</span>
              <span>{this.employeeDetailData.emailAddress}</span>
              <span>{this.employeeDetailData.region}</span>
              <span>{this.employeeDetailData.dob}</span>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default EmployeeHome;
