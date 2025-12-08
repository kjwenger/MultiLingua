# Gemini LLM Integration

A Python module to integrate Google's Gemini Large Language Models into your applications. This module provides a standardized interface for interacting with various Gemini models, including support for streaming, parallel requests, and fine-tuned models.

## Usage

```python
from your_llm_library import Gemini

# Initialize the Gemini model
gemini = Gemini(model="gemini-1.5-flash")

# Generate content
prompt = "Explain the significance of the transformer architecture in modern AI."
response = gemini.generate_content_async(prompt)

print(response)
```

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| `model_name` | The name of the Gemini model to use. | `str` | `gemini-1.5-flash` | No |
| `finetuned_model`| Whether the model is a fine-tuned version. | `bool` | `False` | No |
| `distribute_requests`| Distribute requests across different regions for better availability. | `bool` | `False` | No |
| `cache_name` | The name of the cache to use for the model. | `str` | `None` | No |
| `temperature` | The temperature for the generation. | `float` | `0.01` | No |

## Outputs

| Method | Description |
|------|-------------|
| `generate_content_async` | Returns a single string containing the generated content from the model. |
| `call_parallel` | Returns a list of strings, with each string corresponding to a prompt in the input list. |
| `connect` | Returns a `GeminiLlmConnection` object for real-time, bidirectional communication. |
