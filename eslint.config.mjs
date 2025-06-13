import { withRaclette } from './.raclette/eslint.config.mjs'

export default withRaclette(
    // Your custom configs here
    {
        // Example: Override a rule
        rules: {
            'no-console': 'off'
        }
    },
    // Add more config objects as needed
)