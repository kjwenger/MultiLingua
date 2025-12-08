# Gemini LLM Integration (Resource)

This resource provides an interface to Google's Gemini family of large language models. It is designed to be used within a larger system that standardizes interactions with different LLMs.

## Example Usage

### Basic Text Generation

```python
from your_llm_library import Gemini

# Initialize with a specific model
gemini_pro = Gemini(model="gemini-1.5-pro")

# Generate content asynchronously
response = await gemini_pro.generate_content_async("What are the main differences between supervised and unsupervised learning?")

print(response)
```

### Parallel Text Generation

```python
from your_llm_library import Gemini

gemini = Gemini()

prompts = [
    "What is the capital of France?",
    "Summarize the plot of 'The Great Gatsby'.",
    "Write a short poem about the rain."
]

# Get responses for multiple prompts in parallel
responses = await gemini.call_parallel(prompts)

for i, response in enumerate(responses):
    print(f"Response for prompt {i+1}:\n{response}\n")
```

## Schema

### Required Arguments

-   **`None`**

### Optional Arguments

-   `model_name` (String): The name of the Gemini model to use. Defaults to `gemini-1.5-flash`.
-   `finetuned_model` (Boolean): Specifies if the model is a fine-tuned version. Defaults to `False`.
-   `distribute_requests` (Boolean): If set to `True`, distributes requests across different geographical regions for high availability. Defaults to `False`.
-   `cache_name` (String): The name of the cache to use for storing and retrieving model responses. If not provided, no cache is used.
-   `temperature` (Float): Controls the randomness of the output. A value closer to 0.0 makes the output more deterministic. Defaults to `0.01`.

### Methods

#### `generate_content_async(prompt: str) -> str`
Generates content for a single prompt.

-   **`prompt`** (String, required): The input text to send to the model.

#### `call_parallel(prompts: list[str]) -> list[str]`
Generates content for a list of prompts in parallel.

-   **`prompts`** (List of Strings, required): A list of input texts to send to the model.

#### `connect() -> GeminiLlmConnection`
Establishes a real-time, bidirectional connection to the Gemini LLM for streaming responses.

