import React, { useState } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { ConnectButton, ConnectDialog } from '@connect2ic/react';
import ArrowForwardIcon from '@mui/icons-material/KeyboardArrowRight';
import ICLogo from '../assets/ICLogoWhite.png';
import Roadmap from './roadmap';

const featuresData = [
  {
    title: 'AI-Powered Insights',
    description:
      'Harness AI for real-time predictive analytics on patient health and hospital operations, transforming healthcare delivery.',
    icon: '🧠',
  },
  {
    title: 'Seamless Integration',
    description:
      'Smoothly embed Varion’s decentralized solutions within existing hospital IT infrastructure without disruption.',
    icon: '🔗',
  },
  {
    title: 'Enhanced Security',
    description:
      'Leverage Internet Identity for decentralized secure identities — no passwords required, full privacy guaranteed.',
    icon: '🔐',
  },
  {
    title: 'On-Chain Inference',
    description:
      'Deploy deep learning directly on-chain via Internet Computer for transparent, verifiable healthcare AI insights.',
    icon: '🔄',
  },
  {
    title: 'Scalable Architecture',
    description:
      'Designed to scale effortlessly, Varion accommodates growing hospitals and healthcare networks anywhere globally.',
    icon: '📈',
  },
  {
    title: 'AI Model Marketplace',
    description:
      'A decentralized store for hospitals and developers to share, license, and collaborate on specialized AI models.',
    icon: '🛒',
  },
];

const FeatureCard = ({ feature, index }) => {
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });

  return (
    <FeatureGlass
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.75, delay: index * 0.15 }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0, 123, 255, 0.3)',
        transition: { duration: 0.18, ease: 'easeOut' },
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
      }}
    >
      <FeatureIcon>{feature.icon}</FeatureIcon>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </FeatureGlass>
  );
};

const PrivacyPolicyPopup = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <PopupOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <PopupContent
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <PopupCloseButton onClick={onClose} aria-label="Close privacy policy modal">&times;</PopupCloseButton>
          <h2>Privacy Policy</h2>
          <p>
            Our platform is designed with your privacy in mind, ensuring that no personal data is stored on our servers. We do not collect, retain, or share any user data. When you interact with our website, all information you provide is used solely for the duration of your session.
          </p>
        </PopupContent>
      </PopupOverlay>
    )}
  </AnimatePresence>
);

const Homepage = () => {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

  return (
    <AnimatePresence>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Navbar>
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Logo src="/varionlogo.png" alt="Varion Logo" />
          </motion.div>
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <StyledConnectButton>
              <ConnectButton className="connect-button">
                <ArrowForwardIcon />
                <span>Launch Varion</span>
              </ConnectButton>
            </StyledConnectButton>
          </motion.div>
        </Navbar>
        <ConnectDialog />

        <ReactFullpage
          licenseKey={'YOUR_KEY_HERE'}
          scrollingSpeed={900}
          navigation
          autoScrolling
          scrollOverflow
          scrollingSensitivity={50}
          scrollOverflowReset
          render={() => (
            <ReactFullpage.Wrapper>
              <div className="section">
                <Hero>
                  <HeroContentGlass>
                    <motion.h1
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                    >
                      Revolutionizing Healthcare with Decentralized AI
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.75 }}
                    >
                      Introducing a Decentralized AI Monitoring Dashboard<br />
                      Elevate patient care and safety to unprecedented levels.
                    </motion.p>
                    <LogoContainer>
                      <motion.img
                        src={ICLogo}
                        alt="IC Logo"
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      />
                    </LogoContainer>
                  </HeroContentGlass>
                </Hero>
              </div>
              <div className="section">
                <About>
                  <motion.h2
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    Why Varion?
                  </motion.h2>
                  <Features>
                    {featuresData.map((feature, index) => (
                      <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                  </Features>
                </About>
              </div>
              <div className="section">
                <RoadmapSection>
                  <motion.h2
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    Our Roadmap
                  </motion.h2>
                  <Roadmap />
                </RoadmapSection>
              </div>
              <div className="section fp-auto-height">
                <Footer>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    &copy; 2024 Varion. All rights reserved.
                  </motion.p>
                  <FooterLinks>
                    <motion.a
                      href="#"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      onClick={() => setIsPrivacyPolicyOpen(true)}
                    >
                      Privacy Policy
                    </motion.a>
                  </FooterLinks>
                </Footer>
              </div>
            </ReactFullpage.Wrapper>
          )}
        />
        <PrivacyPolicyPopup
          isOpen={isPrivacyPolicyOpen}
          onClose={() => setIsPrivacyPolicyOpen(false)}
        />
      </Container>
    </AnimatePresence>
  );
};

/* --- STYLED COMPONENTS --- */

const Container = styled(motion.div)`
  font-family: 'Inter', 'Poppins', 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
  color: #121926;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  letter-spacing: 0.015em;
  font-size: 1rem;
  font-weight: 400;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0; right: 0;
  height: 64px;
  padding: 0 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: saturate(180%) blur(12px);
  background: rgba(255 255 255 / 0.25);
  border-bottom: 1.3px solid rgba(255 255 255 / 0.4);
  box-shadow: 0 6px 32px rgba(20, 40, 90, 0.15);
  z-index: 1100;

  @media (max-width: 600px) {
    padding: 0 1.15rem;
    height: 54px;
  }
`;

const Logo = styled.img`
  height: 2.3rem;
  width: auto;
  cursor: pointer;
`;

const StyledConnectButton = styled.div`
  .connect-button {
    background: linear-gradient(90deg, #1a75ed 0%, #36aade 100%);
    color: #fff;
    border: none;
    padding: 0.55rem 1.55rem;
    border-radius: 23px;
    cursor: pointer;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.55px;
    transition: box-shadow 0.22s ease, background 0.3s ease;
    box-shadow: 0 3px 18px rgba(66, 133, 244, 0.35);
    display: flex;
    align-items: center;
    font-size: 1.05rem;

    &:hover {
      background: linear-gradient(90deg, #0e53a4 0%, #208bd9 100%);
      box-shadow: 0 6px 28px rgba(66, 133, 244, 0.5);
    }
    span {
      margin-right: 6px;
      letter-spacing: 0.6px;
    }
    svg {
      font-size: 1.3rem;
      margin-left: 8px;
    }
  }
`;

const Hero = styled.section`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  background: linear-gradient(135deg, #eef5fb 0%, #cde6fc 100%);
`;

const HeroContentGlass = styled(motion.div)`
  background: rgba(255 255 255 / 0.3);
  box-shadow: 0 8px 36px rgba(0, 123, 255, 0.18);
  backdrop-filter: saturate(180%) blur(15px);
  border-radius: 28px;
  padding: 3.5rem 3rem;
  max-width: 38rem;
  color: #101828;
  text-align: center;

  h1 {
    font-size: 2.7rem;
    font-weight: 700;
    color: #003a8c;
    margin-bottom: 1.15rem;
    letter-spacing: 0.01em;
    user-select: none;
  }

  p {
    font-size: 1.21rem;
    margin-bottom: 2rem;
    font-weight: 500;
    color: #2455b2d9;
    user-select: none;
  }

  @media (max-width: 420px) {
    padding: 3rem 2rem;
    h1 {
      font-size: 2.1rem;
    }
  }
`;

const LogoContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  img {
    height: 1.6rem;
    width: auto;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
  }
`;

const About = styled.section`
  padding: 3rem 1rem 3rem;
  background: linear-gradient(135deg, #c8e1ff 0%, #f5fbff 100%);
  min-height: auto;
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 1.7rem;
    font-weight: 700;
    margin-bottom: 2.8rem;
    color: #204192e8;
    text-align: center;
    letter-spacing: 0.02em;
    user-select: none;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
  gap: 1.8rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureGlass = styled(motion.div)`
  background: rgba(255 255 255 / 0.28);
  border-radius: 20px;
  padding: 1.5rem 1.7rem;
  box-shadow: 0 14px 40px rgba(3, 67, 251, 0.1);
  backdrop-filter: saturate(190%) blur(22px);
  border: 1.2px solid rgba(255 255 255 / 0.35);
  cursor: default;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  min-height: 220px;

  h3 {
    color: #064091;
    font-weight: 700;
    margin: 0.4rem 0 1rem 0;
    font-size: 1.12rem;
    letter-spacing: 0.01em;
  }
  p {
    color: #3755a4dd;
    font-weight: 500;
    margin: 0;
    font-size: 0.97rem;
    flex-grow: 1;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.3rem;
  color: #1862f0;
  user-select: none;
  transition: transform 0.18s ease-out;

  ${FeatureGlass}:hover & {
    transform: scale(1.25) rotate(7deg);
  }
`;

const RoadmapSection = styled.section`
  padding: 3rem 1.4rem 4rem;
  min-height: 100vh;
  background: linear-gradient(150deg, #dbe8ff 0%, #f8fbff 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-weight: 700;
    font-size: 1.65rem;
    margin-bottom: 2.3rem;
    color: #004bb5cc;
    text-align: center;
    letter-spacing: 0.01em;
    user-select: none;
  }
`;

const Footer = styled.footer`
  background: rgba(255 255 255 / 0.6);
  backdrop-filter: saturate(180%) blur(20px);
  padding: 3rem 1.5rem;
  border-top: 1.6px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  color: #3d4668dd;
  font-size: 0.92rem;
  user-select: none;
`;

const FooterLinks = styled.div`
  margin-top: 1.7rem;

  a {
    color: #2060f0dd;
    text-decoration: none;
    font-weight: 600;
    margin: 0 1.3rem;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover,
    &:focus {
      color: #134ac0;
      transform: translateY(-3px);
      text-decoration: underline;
    }
  }
`;

const PopupOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(14, 17, 22, 0.71);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1300;
`;

const PopupContent = styled(motion.div)`
  background: rgba(255 255 255 / 0.9);
  width: 90%;
  max-width: 480px;
  border-radius: 22px;
  padding: 2rem 2.4rem;
  box-shadow: 0 14px 50px rgb(33 111 242 / 0.3);
  backdrop-filter: saturate(150%) blur(24px);
  position: relative;

  h2 {
    color: #1044a4;
    margin-bottom: 1.2rem;
    font-weight: 700;
    font-size: 1.5rem;
    user-select: none;
  }

  p {
    color: #2d2f33dd;
    line-height: 1.65;
    font-weight: 500;
  }
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: #0c52a4;
  font-weight: 700;
  transition: color 0.2s ease;

  &:hover,
  &:focus {
    color: #093779;
  }
`;

const HideFullpageCredits = styled.div`
  .fp-watermark {
    display: none !important;
  }
`;

export default () => (
  <HideFullpageCredits>
    <Homepage />
  </HideFullpageCredits>
);
