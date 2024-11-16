import React, { useState } from 'react';
import styles from './Footer.module.css';
import { handleError, handleSuccess } from '../../Utils';

const Footer = () => {
    const [messageDetails, setMessageDetails] = useState({messages: "", email: ""});

    const token = localStorage.getItem('token'); 

    const handleSubmit = async(e) => {
        e.preventDefault();

      
        
        const {messages, email} = messageDetails;

        if(!messages || !email){
            return handleError(" Description, Category and Amount are compulsory ");
        }
        
        try {
            
            
         const url = "http://localhost:3000/contact/feedback";
          const response = await fetch(url,
                {
                    method: "POST",
                    body: JSON.stringify({
                        messages,
                        email
                    }),
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization":token
                    }
                }
            );
            
            const result = await response.json();
            
            const {success, message, error} = result;
            
            if(success){
                handleSuccess(message);
                setMessageDetails({messages: "", email: ""});
           
              
           } else if(error){
            const detail = error.details[0].message;
            handleError(detail);
           } else if(!success){
            handleError(message);
           }
    
           console.log(result);
           
           
    
        } catch (error) {
            handleError(error);
        }


      
    };

    const handleChange = (e) => {
        const {name,value} = e.target;
        setMessageDetails((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <footer >
		<div className={styles.footerContainer}>
		<div className={styles.section}>
                {/* <img
                    src="https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg"
                    alt="Logo"
                    className={styles.footerLogo}
                /> */}
				<h2 className={styles.footerLogo}>TRACKFI</h2>
                <p className={styles.description}>
				Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
                </p>
                <div className={styles.socialIcons}>
                    <a href="#" className={styles.socialLink}>
						<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 24 24" 
						fill="currentColor"  >
							<path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
						</svg>
					</a>
                    <a href="#" className={styles.socialLink}>
							<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                            </svg>
					</a>
                    <a href="#" className={styles.socialLink}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
                                <circle cx="16.806" cy="7.207" r="1.078"></circle>
                                <path
                                    d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"
                                ></path>
                            </svg>
					</a>
                    <a href="#" className={styles.socialLink}>
							<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                                ></path>
                            </svg>
					</a>
                </div>
            </div>

            <div className={styles.footerContent}>
                <div>
                    <p className={styles.sectionHeading}>Company</p>
                    <ul className={styles.linkList}>
                        <li className={styles.linkItem}><a href="#">About</a></li>
                        <li className={styles.linkItem}><a href="#">Features</a></li>
                        <li className={styles.linkItem}><a href="#">Works</a></li>
                        <li className={styles.linkItem}><a href="#">Career</a></li>
                    </ul>
                </div>

                <div>
                    <p className={styles.sectionHeading}>Help</p>
                    <ul className={styles.linkList}>
                        <li className={styles.linkItem}><a href="#">Customer Support</a></li>
                        <li className={styles.linkItem}><a href="#">Delivery Details</a></li>
                        <li className={styles.linkItem}><a href="#">Terms & Conditions</a></li>
                        <li className={styles.linkItem}><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className={styles.contactSection}>
                    <p className={styles.sectionHeading}>Send Your Feedback</p>
                    <form onSubmit={handleSubmit} className={styles.subscribeForm}>
                        <textarea
                            type="text"
                            placeholder="Enter your message"
                            value={messageDetails.messages}
                            name='messages'
                            onChange={handleChange}
                            className={styles.subscribeInput}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={messageDetails.email}
                            name='email'
                            onChange={handleChange}
                            className={styles.subscribeInput}
                            required
                        />
                        <button type="submit" className={styles.subscribeButton}>Submit</button>
                    </form>
                </div>
            </div>
		</div>
           

            <hr className={styles.footerSeparator} />
            <p className={styles.footerBottomText}>© 2024 TrackFI. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;
