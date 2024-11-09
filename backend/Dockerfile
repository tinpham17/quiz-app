# Step 1: Use Node.js image with TypeScript installed
FROM node:18

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Transpile TypeScript (if using TypeScript)
RUN npm run build

# Step 7: Expose the port the app will run on
EXPOSE 4000

# Step 8: Start the application
CMD ["npm", "run", "start"]
