import React, { Component } from 'react';

import Modal from "./modal"
import more from "./assets/more.png"

class EmployeeHome extends Component {
  constructor(props){
    super(props);
    this.state = {
      showDetailModal: false,
      showAddModal: false,
      currentIndex: "",
      sortBy: "firstName",
      formData : {
        id: "",
        jobTitleName: "",
        firstName: "",
        lastName: "",
        preferredFullName: "",
        employeeCode: "",
        region: "",
        dob: "",
        phoneNumber: "",
        emailAddress: ""
      },
      employeeData: [],
      filteredEmployeeData: []
      
    }
    this.closeModal =  this.closeModal.bind(this);
    this.submitEmployeeForm =  this.submitEmployeeForm.bind(this);
    this.filterList =  this.filterList.bind(this);
    this.employeeDetailData =  "";
  }

  componentDidMount() {
    this.fetchData().then((data)=>{
      if(!localStorage.getItem("employee_data") || JSON.parse(localStorage.getItem("employee_data")).length === 0){
        console.log('le')
        localStorage.setItem("employee_data", JSON.stringify(data));
        this.setState({
          employeeData: data
        })
      }
      else {
        this.setState({
          employeeData: JSON.parse(localStorage.getItem("employee_data"))
        })
      }
    });
    this.sortMe(this.state.sortBy);
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

  showAddModal(data, index) {
    let newState = {...this.state};
    newState["showAddModal"]=  true;
    newState["formData"] = {...data}
    newState["currentIndex"] = index;
    this.setState(newState);
  }

  closeModal(data) {
    this.setState({
      showDetailModal: false,
      showAddModal: false
    })
  }

  submitEmployeeForm(event, index) {
    let newState = {...this.state};
    event.preventDefault();
    if(this.state.formData.id) {
      newState.employeeData[this.state.currentIndex] =  this.state.formData;
    }
    else {
      let createdData  = this.state.formData;
      createdData.id = newState.employeeData.length+1;
      createdData.employeeCode = `E${newState.employeeData.length+1}`
      newState.employeeData.unshift(createdData);
    }
    localStorage.setItem("employee_data", JSON.stringify(newState.employeeData  ))
    this.setState(newState);
    this.closeModal();
  }

  handleInputChange(key, value, validationType, minLength, maxLength) {
    var newState = { ...this.state };

      if(value.length > maxLength)
          value = value.substring(0, maxLength);

      value = value.replace(validationType === 'email' 
                          ? /[^\w\@\-\.]/gi 
                          : (validationType === 'alpha_numeric' 
                              ? /[^\w]/gi 
                              : (validationType === 'alpha_space' 
                                  ? /[^\w\d\s]/gi 
                                  : (validationType === 'address' 
                                      ? /[^\w\s\-\,]/gi 
                                      : /[^\d]/gi
                                  )
                                  )
                              ), 
                          "");
      

      newState.formData[key] = value
      this.setState(newState);
  }

  deleteEmployee(index) {
    let newState = {...this.state};
    newState.employeeData.splice(index, 1);
    localStorage.setItem("employee_data", JSON.stringify(newState.employeeData  ))
    this.setState(newState);
  }

  sortMe(sortby) {
    let newState = {...this.state};
    newState.sortBy = sortby;
    newState.employeeData.sort((a, b) => (a[sortby].toLowerCase() > b[sortby].toLowerCase()) ? 1 : -1);
    this.setState(newState);
  }

  filterList(event) {
    let newState = {...this.state};
    newState.filteredEmployeeData = newState.employeeData.filter((item) =>{
      console.log(item)
      return item.firstName.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    })
    this.setState(newState);
  }

  render() {
    const employeeData = this.state.filteredEmployeeData.length === 0 ?  this.state.employeeData : this.state.filteredEmployeeData;
    return (
      <div className="employee-home-wrap">
        <h1>Employees <button onClick={()=> this.showAddModal({})}>Create Employee</button></h1>
        <div className="sort-wrap">
          <div>
            <span>SortBy: {this.state.sortBy}</span>
            <div className="dropdown">
              <span onClick={()=> this.sortMe("firstName")}>Name</span>
              <span onClick={()=> this.sortMe("region")}>Region</span>
            </div>
          </div>
          <div>
            <input type="text" placeholder="Search by Name" onChange={this.filterList} />
          </div>
        </div>
        
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
                employeeData && employeeData.length>0 && employeeData.map((employee, index) => {
                  return(
                    <tr key={index}>
                      <td onClick={()=> this.showDetailModal(employee)}>{employee.id}</td>
                      <td>{employee.firstName} {employee.lastName}</td>
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
                            <span onClick={()=> this.showAddModal(employee, index)}>Edit</span>
                            <span onClick={()=> this.deleteEmployee(index)}>Delete</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
              {
                employeeData.length === 0 ? (
                  <p>No data found !</p>
                ): null
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
          <h2 className="employee-name">{this.employeeDetailData.firstName}{this.employeeDetailData.lastName}</h2>
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
              <span>{this.employeeDetailData.firstName}{this.employeeDetailData.lastName}</span>
              <span>{this.employeeDetailData.employeeCode}</span>
              <span>{this.employeeDetailData.jobTitleName}</span>
              <span>{this.employeeDetailData.phoneNumber}</span>
              <span>{this.employeeDetailData.emailAddress}</span>
              <span>{this.employeeDetailData.region}</span>
              <span>{this.employeeDetailData.dob}</span>
            </div>
          </div>
        </Modal>

        <Modal
          className="employee-add-modal"
          visible={this.state.showAddModal}
          animation="fadeIn"
          onClose={this.closeModal}
        >
          <h2>Create Employee</h2>
          <form onSubmit = {this.submitEmployeeForm}>
            <div className="form-group">
            <div className="flex-form-group">
              <div className="form-group">
                <label>First Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Manic" 
                  value={this.state.formData.firstName}
                  onChange={({ target } ) => {this.handleInputChange('firstName', target.value, 'alpha_space', 1, 100)}}

                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Chuggh" 
                  value={this.state.formData.lastName}
                  onChange={({ target } ) => {this.handleInputChange('lastName', target.value, 'alpha_space', 1, 100)}}
                />
              </div>
            </div>
              <label>Job Title</label>
              <input 
                required
                type="text" 
                placeholder="Designer" 
                value={this.state.formData.jobTitleName}
                onChange={({ target } ) => {this.handleInputChange('jobTitleName', target.value, 'alpha_space', 1, 100)}}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                required
                type="email" 
                placeholder="joe@gmail.com" 
                value={this.state.formData.emailAddress}
                onChange={({ target } ) => {this.handleInputChange('emailAddress', target.value, 'email', 1, 100)}}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                required
                type="text" 
                placeholder="044-289302023" 
                value={this.state.formData.phoneNumber}
                onChange={({ target } ) => {this.handleInputChange('phoneNumber', target.value, 'alpha_space', 1, 100)}}
              />
            </div>
            <div className="flex-form-group">
              <div className="form-group">
                <label>Region</label>
                <input
                  required
                  type="text" 
                  placeholder="CA" 
                  value={this.state.formData.region}
                  onChange={({ target } ) => {this.handleInputChange('region', target.value, 'alpha_space', 1, 100)}}
                />
              </div>
              <div className="form-group">
                <label>DOB</label>
                <input
                  required
                  type="text" 
                  placeholder="05-07-1993" 
                  value={this.state.formData.dob}
                  onChange={({ target } ) => {this.handleInputChange('dob', target.value, 'address', 1, 100)}}
                />
              </div>
            </div>
            <div className="button-wrap">
              <button type="submit">Create</button>
              <button type="button" onClick={()=> this.closeModal()}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}
export default EmployeeHome;
