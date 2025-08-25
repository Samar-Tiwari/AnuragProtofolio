import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './protfolio.component.html',
  styleUrls: ['./protfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  
  // Form data
  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  // Form submission state
  isSubmitting = false;

  // Intersection Observer for animations
  private intersectionObserver!: IntersectionObserver;
  private skillObserver!: IntersectionObserver;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Component initialization
    this.initializeScrollListeners();
  }

  ngAfterViewInit(): void {
    // Initialize animations after view is loaded
    this.initializeAnimations();
    this.initializeSkillBars();
    this.initializeFloatingAnimation();
  }

  ngOnDestroy(): void {
    // Clean up observers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.skillObserver) {
      this.skillObserver.disconnect();
    }
  }

  /**
   * Initialize scroll listeners for navigation effects
   */
  private initializeScrollListeners(): void {
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    });
  }

  /**
   * Initialize scroll animations using Intersection Observer
   */
  private initializeAnimations(): void {
    const animateElements = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');
    
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach((el: Element) => this.intersectionObserver.observe(el));
  }

  /**
   * Initialize skill bar animations
   */
  private initializeSkillBars(): void {
    const skillBars = this.elementRef.nativeElement.querySelectorAll('.skill-progress');
    
    this.skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillBar = entry.target as HTMLElement;
          const originalWidth = skillBar.style.width;
          
          // Reset width to 0
          skillBar.style.width = '0%';
          
          // Animate to original width after delay
          setTimeout(() => {
            skillBar.style.width = originalWidth;
          }, 500);
        }
      });
    }, { 
      threshold: 0.5 
    });

    skillBars.forEach((bar: Element) => this.skillObserver.observe(bar));
  }

  /**
   * Initialize floating animation for hero image
   */
  private initializeFloatingAnimation(): void {
    const heroImage = this.elementRef.nativeElement.querySelector('.hero-image');
    if (!heroImage) return;

    let floatDirection = 1;
    const floatSpeed = 2;
    const floatRange = 20;
    
    const animate = () => {
      const currentTransform = heroImage.style.transform || 'translateY(0px)';
      const currentY = parseInt(currentTransform.match(/translateY\((-?\d+)px\)/)?.[1] || '0');
      
      if (currentY >= floatRange || currentY <= -floatRange) {
        floatDirection *= -1;
      }
      
      heroImage.style.transform = `translateY(${currentY + (floatDirection * floatSpeed)}px)`;
    };

    // Start animation
    setInterval(animate, 100);
  }

  /**
   * Handle contact form submission
   */
  onSubmit(): void {
    // Basic validation
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      alert('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Set submitting state
    this.isSubmitting = true;

    // Simulate form submission (replace with actual service call)
    setTimeout(() => {
      this.handleFormSubmissionSuccess();
    }, 2000);
  }

  /**
   * Handle successful form submission
   */
  private handleFormSubmissionSuccess(): void {
    alert(`Thank you for your message, ${this.formData.name}! I will get back to you soon.`);
    this.resetForm();
    this.isSubmitting = false;
  }

  /**
   * Handle form submission error
   */
  private handleFormSubmissionError(error: any): void {
    console.error('Form submission error:', error);
    alert('Sorry, there was an error sending your message. Please try again later.');
    this.isSubmitting = false;
  }

  /**
   * Reset contact form
   */
  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

  /**
   * Smooth scroll to section (utility method)
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Get current year for footer
   */
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  /**
   * Open external link
   */
  openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Send email
   */
  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  /**
   * Make phone call
   */
  makePhoneCall(phoneNumber: string): void {
    window.location.href = `tel:${phoneNumber}`;
  }

  /**
   * Copy text to clipboard
   */
  copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showTemporaryMessage('Copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        this.fallbackCopyTextToClipboard(text);
      });
    } else {
      this.fallbackCopyTextToClipboard(text);
    }
  }

  /**
   * Fallback copy method for older browsers
   */
  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showTemporaryMessage('Copied to clipboard!');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  }

  /**
   * Show temporary message to user
   */
  private showTemporaryMessage(message: string): void {
    // Create temporary toast message
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-weight: 600;
      animation: slideInRight 0.3s ease-out;
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 3000);
  }

  /**
   * Track analytics event (placeholder for analytics integration)
   */
  trackEvent(eventName: string, properties?: any): void {
    console.log('Analytics Event:', eventName, properties);
    // Integrate with your analytics service (Google Analytics, Mixpanel, etc.)
  }

  /**
   * Download resume (placeholder method)
   */
  downloadResume(): void {
    this.trackEvent('resume_download');
    // Implement resume download functionality
    console.log('Download resume functionality - implement based on your needs');
  }

  /**
   * Print page
   */
  printPage(): void {
    this.trackEvent('page_print');
    window.print();
  }
}