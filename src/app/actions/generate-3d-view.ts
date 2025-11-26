'use server';

import { GoogleAuth } from 'google-auth-library';

export async function generate3DView(floorPlanContext: string, imageBase64?: string) {
  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const token = accessToken.token;
    
    const project = 'genarch';
    const location = 'global'; // Requested location for this preview model
    const model = 'gemini-3-pro-image-preview';
    const url = `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/${project}/locations/${location}/publishers/google/models/${model}:streamGenerateContent`;

    // Construct request body exactly as requested
    const parts: any[] = [];
    
    // Add the image if provided (as requested by user)
    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: 'image/png',
          data: imageBase64
        }
      });
    }

    // Add the text context (we keep this to ensure the floor plan details are conveyed)
    parts.push({
      text: `Generate a high-quality, photorealistic isometric 3D floor plan view. 
      
      CONTEXT: ${floorPlanContext}
      
      REQUIREMENTS:
      - View: Isometric 3D from a top-down angle (approx 45 degrees).
      - Lighting: Bright, natural lighting.
      - Style: Modern, clean, architectural.
      - Furnishing: Realistic furniture.
      - Walls: Cut-away.
      `
    });

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: parts
        }
      ],
      generation_config: {
        temperature: 1,
        top_p: 0.95,
        max_output_tokens: 32768,
        response_modalities: ["TEXT", "IMAGE"], // Key requirement from user
        // Note: API expects 'camelCase' for JSON fields usually, but some endpoints support snake_case.
        // The error 'Unknown name "output_mime_type"' suggests it's either the wrong name or casing.
        // Trying 'mimeType' (standard Google API style) or removing if optional.
        // Based on common Vertex schemas, it might be just 'mimeType' or not supported at this nesting level.
        // Let's try removing it first as PNG is default for most image models.
        image_config: {
          aspect_ratio: "16:9",
          image_size: "1K",
        }
      },
      safety_settings: [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" }
      ]
    };

    console.log('Calling Vertex AI URL:', url);

    // Since this is a preview model, we might need to use the specific endpoint or potentially 'us-central1'
    // if 'global' fails for prediction, but let's try 'us-central1' first as per the error message hint earlier
    // which mentioned `us-central1-aiplatform...`.
    // Actually, the error message earlier showed the URL containing `us-central1...` but user said "Location global".
    // The endpoint host `us-central1-aiplatform.googleapis.com` is for `us-central1` regional endpoint.
    // If the model is GLOBAL, the endpoint might differ, or it might be accessible via `us-central1` with a global model reference.
    // Let's stick to the user's feedback implies 'us-central1' host but maybe they meant the model resource is global?
    // Wait, the Python code didn't specify the endpoint explicitly, it used `genai.Client`.
    // Let's try the `us-central1` host with `us-central1` location first, as that is standard for Vertex.
    // IF that fails, we try `global`.
    // Re-reading the error: "Publisher Model `projects/genarch/locations/us-central1/publishers/google/models/gemini-3-pro-image-preview` was not found"
    // This implies the model IS NOT in `us-central1`. It is likely in `us-central1` but the resource path is different OR it requires a different location.
    
    // Correction: User said `Location global` in feedback. 
    // So the URL path should probably use `locations/global`.
    // BUT the HOSTNAME for global endpoints is typically `aiplatform.googleapis.com` (not regional).
    
    // Let's try the explicit global endpoint path on the generic host.
    
    const globalUrl = `https://aiplatform.googleapis.com/v1beta1/projects/${project}/locations/global/publishers/google/models/${model}:streamGenerateContent`;

    const response = await fetch(globalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vertex AI Error:', response.status, errorText);
      
      // Fallback attempt: If global fails, try us-central1 (some preview models are regional)
      // Note: The user explicitly mentioned 'Location global', so we trust that first.
      return { image: null, error: `Vertex AI Error: ${response.statusText} - ${errorText}` };
    }

    // Handle Stream Response
    // The API returns a stream of JSON chunks. We need to parse them.
    // For simplicity in this server action, we'll buffer the stream or handle it as a simple JSON if not actually streaming?
    // `streamGenerateContent` returns a stream. `generateContent` returns a single response.
    // The user used `generate_content_stream`.
    // We will treat the response as a stream and concatenate chunks.
    
    // However, `fetch` in Node doesn't auto-parse stream unless we iterate.
    // Since this is a server action returning a promise, let's accumulate the chunks.
    
    // Actually, if we want to wait for the image, we iterate the stream.
    
    const reader = response.body?.getReader();
    let fullText = '';
    let imageBytes = '';
    
    if (reader) {
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunkStr = decoder.decode(value, { stream: true });
            // The stream sends JSON objects, possibly multiple or partial? 
            // Vertex AI stream sends JSON objects like [{...}].
            // It's simpler to accumulate and parse, BUT for streaming it might be array elements.
            // Let's assume we get a JSON array of candidates.
            
            // Actually, dealing with raw stream parsing of JSON is brittle.
            // Let's switch to `generateContent` (non-stream) if possible?
            // User used `generate_content_stream`.
            // The logic for parsing the image from the stream:
            // "parts": [{"inlineData": {"mimeType": "image/png", "data": "..."}}]
            
            // Let's buffer the whole response text (it might be an array of objects like `[{...}, {...}]` or strictly `[...]` format).
            // Actually, standard Vertex REST API `streamGenerateContent` returns a series of JSON objects, NOT valid JSON array overall.
            // e.g. `{...}\n{...}`.
            
            fullText += chunkStr;
        }
    }
    
    // Simple parser for concatenated JSON objects (Vertex stream format)
    // Usually they are separated by newlines or just appended.
    // We look for `inlineData` or `inline_data` in the response.
    
    // Regex to extract image data might be safer than parsing possibly broken JSON stream text manually
    // "data": "base64..."
    // We need the LAST image or the one in the response.
    
    // Let's use a simple regex to find the base64 data if parsing fails.
    // But we should try to parse properly.
    // Vertex stream responses are independent JSON objects usually.
    
    // Splitting by `\n` might work if they send one per line.
    // Or try to find `"mimeType": "image/png", "data": "`
    
    // Let's try to find the image data in the text.
    const imageMatch = fullText.match(/"data":\s*"([^"]+)"/);
    if (imageMatch && imageMatch[1]) {
        return { image: imageMatch[1], error: null };
    }
    
    // Fallback: Check if it was a text-only response
    return { image: null, error: 'No image generated in response.' };

  } catch (error: any) {
    console.error('Failed to generate 3D view:', error);
    return { image: null, error: error.message || 'Failed to generate 3D view.' };
  }
}