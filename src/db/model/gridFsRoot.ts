import { model, Schema } from "mongoose";
import { IMetaDataCollection } from "../../types/Interface/IDBmodel";

const gridFsRootScheme = new Schema<IMetaDataCollection>({
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String
    },
    length: {
        type: Number
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: Map, of: Schema.Types.Mixed
    }
})

const GridFsRoot = model<IMetaDataCollection>("file-meta-data", gridFsRootScheme);
export default GridFsRoot