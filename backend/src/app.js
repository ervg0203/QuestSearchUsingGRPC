const mongoose = require("mongoose");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// MongoDB connection details
const DATABASE_URL = "mongodb://localhost:27017/";
const DATABASE_NAME = "questsearch";

// gRPC Protocol Path
const PROTO_FILE_PATH = __dirname + "/proto/questions.proto";

// Load Proto Definition
const packageDefinition = protoLoader.loadSync(PROTO_FILE_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const { QuestionService } = protoDescriptor.questions;

// Custom Error Handler
const handleError = (message, error = null) => {
  console.log(`ERROR: ${message}`);
  if (error) console.log(`Details: ${error.message || error}`);
  process.exit(1);
};

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL, { dbName: DATABASE_NAME });
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    handleError("Failed to connect to MongoDB", err);
  }
};

// Mongoose Model Definition
const Question = mongoose.model(
  "Question",
  new mongoose.Schema({
    type: String,
    title: String,
    siblingId: mongoose.Schema.Types.ObjectId,
  })
);

// gRPC Service Logic
const searchQuestions = async (call, callback) => {
  const { query, page = 1, pageSize = 10 } = call.request;
  const skipResults = (page - 1) * pageSize;

  try {
    const documents = await Question.find({ title: new RegExp(query, "i") })
      .skip(skipResults)
      .limit(pageSize);

    const totalDocuments = await Question.countDocuments({
      title: new RegExp(query, "i"),
    });

    const formattedQuestions = documents.map((doc) => ({
      id: doc._id.toString(),
      type: doc.type,
      title: doc.title,
      siblingId: doc.siblingId ? doc.siblingId.toString() : null,
    }));

    callback(null, {
      questions: formattedQuestions,
      totalResults: totalDocuments,
      totalPages: Math.ceil(totalDocuments / pageSize),
    });
  } catch (err) {
    callback(err, null);
  }
};

// Create and return gRPC server
const createGrpcServer = () => {
  const server = new grpc.Server();
  server.addService(QuestionService.service, { searchQuestions });
  return server;
};

// Main entry point for the server
if (require.main === module) {
  connectToDatabase()
    .then(() => {
      const grpcServer = createGrpcServer();
      grpcServer.bindAsync(
        "0.0.0.0:6000",
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
          if (err) {
            handleError("Failed to bind gRPC server", err);
            return;
          }
          console.log(`gRPC Server running at http://0.0.0.0:6000`);
        }
      );
    })
    .catch((err) => {
      handleError("Error starting the server", err);
    });
}

exports.createGrpcServer = createGrpcServer;
