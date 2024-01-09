import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.
const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
    activeOptionId: categoriesList[0].id,
  }

  componentDidMount = () => this.getProjectsList()

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const updatedData = fetchedData.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      console.log(updatedData)
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetryButton = () => this.getProjectsList()

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetryButton}>
        Retry
      </button>
    </div>
  )

  renderProjectListView = () => {
    const {projectsList} = this.state
    return (
      <ul>
        {projectsList.map(each => (
          <li key={each.id}>
            <img src={each.imageUrl} alt={each.name} />
            <p>{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  onChangeOptionId = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectsList)
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state
    console.log(activeOptionId)
    return (
      <div>
        <nav>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <select value={activeOptionId} onChange={this.onChangeOptionId}>
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderView()}
      </div>
    )
  }
}

export default App
