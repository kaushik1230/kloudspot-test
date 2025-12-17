import { BrowserRouter ,Routes,Route,Navigate} from 'react-router-dom'
import './App.css'
import LoginPage from './LoginPage.jsx'
import Dashboard from './Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoutes.jsx'



function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          
     
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
     
    </BrowserRouter>
    
    </>
  )
}

export default App


