import { Runware } from 'runware';

// Initialize Runware client
const runware = new Runware({
  apiKey: 'YOUR_API_KEY' // Replace with your actual API key
});

const promptInput = document.getElementById('prompt');
const generateButton = document.getElementById('generate');
const statusElement = document.getElementById('status');
const generatedImage = document.getElementById('generated-image');

async function generateImage(prompt) {
  try {
    // Connect to Runware
    await runware.connect();

    // Update UI state
    generateButton.disabled = true;
    statusElement.textContent = 'Generating image...';
    generatedImage.style.display = 'none';

    // Create image generation request
    const request = {
      positivePrompt: prompt,
      model: 'civitai:36520@76907', // Using a default model
      numberResults: 1,
      height: 512,
      width: 512,
      outputFormat: 'PNG'
    };

    // Generate the image
    const images = await runware.imageInference(request);

    if (images && images.length > 0) {
      // Display the generated image
      generatedImage.src = images[0].imageURL;
      generatedImage.style.display = 'block';
      statusElement.textContent = 'Image generated successfully!';
    } else {
      throw new Error('No image was generated');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    statusElement.textContent = 'Error: Failed to generate image. Please try again.';
  } finally {
    generateButton.disabled = false;
  }
}

// Event Listeners
generateButton.addEventListener('click', () => {
  const prompt = promptInput.value.trim();
  if (prompt) {
    generateImage(prompt);
  } else {
    statusElement.textContent = 'Please enter a description for the image.';
  }
});

promptInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !generateButton.disabled) {
    generateButton.click();
  }
});