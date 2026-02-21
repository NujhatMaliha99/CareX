import { useNavigate,Link } from "react-router-dom";

export default function Resources()
{
    const navigate = useNavigate();

  const resources = [
    {
      title: "Book an appointment",
      description: "Find doctors, clinics, hospitals and more",
      icon: "📅"
    },
    {
      title: "Chat with a doctor now",
      description: "Get a response within 5 minutes! 3 day free followup included",
      icon: "💬"
    },
    {
      title: "Order medicines",
      description: "Get medicines delivered to your doorstep",
      icon: "🛒"
    },
    {
      title: "Book tests and scans",
      description: "Find trusted diagnostic labs near you",
      icon: "🧪"
    },
    {
      title: "Ask a free question",
      description: "Get answers from doctors and experts",
      icon: "❓"
    },
    {
      title: "Add a medical record",
      description: "Upload prescriptions, reports and more",
      icon: "📁"
    },
    {
      title: "Set medicine reminders",
      description: "Get alerts so you never miss a dose",
      icon: "⏰"
    }
  ];
    return(
        <div>
    <div className ="home-page dreamy-page">
         <div className="dreamy-bg-container">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
                <div className="stars-layer"></div>
            </div>
         <header className="front-page-header">
                <div className="container header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="logo-group">
                        <span className="heart-logo">💙</span>
                        <span className="logo-text">CareX</span>
                    </div>
                    <nav className="front-nav">
                        <Link to="/">Home</Link>
                        <Link to="/resources">Resources</Link>
                        <a href="#about">About</a>
                        <Link to="/mental" className="btn-get-started">Get Started</Link>
                    </nav>
                </div>
            </header>
        </div>
               <div className = "resource-page">
            <div className="resources-container">
      {resources.map((item, index) => (
        <div key={index} className="resource-card">
          
          <div className="resource-left">
            <div className="resource-icon">{item.icon}</div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>

          <div className="resource-arrow">›</div>

        </div>
      ))}
    </div>
    </div>
    </div>
    );
}