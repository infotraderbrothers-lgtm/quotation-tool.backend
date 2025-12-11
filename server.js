const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS - Allow all origins (as per your request)
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    message: 'Trader Brothers PDF Generator API',
    endpoints: {
      health: 'GET /',
      generatePDF: 'POST /api/generate-pdf'
    }
  });
});

// PDF Generation endpoint
app.post('/api/generate-pdf', async (req, res) => {
  let browser;
  
  try {
    console.log('Received PDF generation request');
    
    const { html, filename } = req.body;
    
    if (!html) {
      return res.status(400).json({ 
        error: 'No HTML content provided',
        message: 'Please send HTML content in the request body'
      });
    }

    console.log('Launching browser...');
    
    // Launch Puppeteer with Railway-optimized settings
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    console.log('Browser launched, creating page...');
    const page = await browser.newPage();
    
    // Set content with proper waiting
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('Generating PDF...');
    
    // Generate PDF with A4 settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log('PDF generated successfully');

    // Close browser
    await browser.close();
    browser = null;

    // Set proper headers for PDF download
    const pdfFilename = filename || 'estimate.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send the PDF
    res.send(pdfBuffer);
    
    console.log('PDF sent to client');

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Clean up browser if it's still open
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      message: error.message,
      details: 'Please check that your HTML is valid and try again'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`PDF Generator API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Generate PDF: POST http://localhost:${PORT}/api/generate-pdf`);
});
