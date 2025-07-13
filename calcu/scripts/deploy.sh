#!/bin/bash

# Calculator Smart Contract Deployment Script
# This script builds and deploys the calculator program to Solana

set -e

echo "🚀 Starting Calculator Smart Contract Deployment..."

# Check if required tools are installed
echo "📋 Checking prerequisites..."

if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Please install Anchor: https://book.anchor-lang.com/getting_started/installation.html"
    exit 1
fi

if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn not found. Please install Yarn: https://yarnpkg.com/getting-started/install"
    exit 1
fi

echo "✅ All prerequisites are installed"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build the program
echo "🔨 Building the calculator program..."
anchor build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Get the program ID
PROGRAM_ID=$(solana address -k target/deploy/calculator-keypair.json)
echo "📋 Program ID: $PROGRAM_ID"

# Update Anchor.toml with the new program ID if it's different
CURRENT_PROGRAM_ID=$(grep -o 'calculator = "[^"]*"' Anchor.toml | cut -d'"' -f2)
if [ "$CURRENT_PROGRAM_ID" != "$PROGRAM_ID" ]; then
    echo "🔄 Updating program ID in Anchor.toml..."
    sed -i "s/calculator = \"[^\"]*\"/calculator = \"$PROGRAM_ID\"/" Anchor.toml
    echo "✅ Program ID updated to: $PROGRAM_ID"
fi

# Update the program ID in lib.rs
echo "🔄 Updating program ID in lib.rs..."
sed -i "s/declare_id!(\"[^\"]*\")/declare_id!(\"$PROGRAM_ID\")/" programs/calculator/src/lib.rs
echo "✅ Program ID updated in lib.rs"

# Run tests
echo "🧪 Running tests..."
anchor test

if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Tests failed!"
    exit 1
fi

# Deploy to localnet (optional)
if [ "$1" = "--deploy" ]; then
    echo "🚀 Deploying to localnet..."
    
    # Check if localnet is running
    if ! solana cluster-version &> /dev/null; then
        echo "⚠️  Localnet not running. Starting localnet..."
        solana-test-validator &
        sleep 5
    fi
    
    anchor deploy
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        echo "🎉 Calculator program is now live on localnet!"
        echo "📋 Program ID: $PROGRAM_ID"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "💡 To deploy to localnet, run: ./scripts/deploy.sh --deploy"
fi

echo "🎉 Calculator Smart Contract setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run tests: anchor test"
echo "2. Deploy to localnet: ./scripts/deploy.sh --deploy"
echo "3. Deploy to devnet: anchor deploy --provider.cluster devnet"
echo "4. Use the client: node app/calculator-client.ts"
echo ""
echo "📚 Documentation: README.md" 