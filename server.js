const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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
        error: 'No HTML content provided'
      });
    }

    console.log('Launching browser...');
    
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-dev-tools',
        '--no-zygote',
        '--single-process'
      ]
    });

    console.log('Browser launched successfully');
    const page = await browser.newPage();
    
    // Set content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('Generating PDF...');
    
    // Generate PDF
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

    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Close browser
    await browser.close();
    browser = null;

    // Send PDF
    const pdfFilename = filename || 'estimate.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
    
    console.log('PDF sent to client successfully');

  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error stack:', error.stack);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`PDF Generator API running on port ${PORT}`);
});
