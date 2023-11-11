import { esbuildVersion } from "vite"
import categoryModel from "../models/categoryModel.js"
import slugify from "slugify"

//create category
export const createCategoryController = async(req,res) => {
    //in try block: get the category entered by the user 
    try{
        const {name} = req.body
        if(!name){
            return res.status(401).send({message:'Name is required'})
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category already exists"
            })
        }

        const category = await new categoryModel({name,slug:slugify(name) }).save()
        res.status(201).send({
            success:true,
            message:'New Category Created',
            category
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Category'
        })
    }

}

//update category
export const updateCategoryController = async(req,res) => {
    try{
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true}) //if new object is not added, no updation will take place
        res.status(200).send({
            success:true,
            message:'Category updated successfully',
            category,
    })  
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while updating category"
        })
    }
}

//viewing all the categories
export const viewCategoryController = async(req,res) =>{
    try{
        const category = await categoryModel.find({}) 
        res.status(200).send({
            success:true,
            message:'All categories list',
            category,
        })

    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting categories'
        })
    }
}

//view single category
export const getCategoryController = async(req,res) => {
    try{

        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:'Specified category viewed successfully',
            category,
        })
    }
    catch{
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting specified category'
        })
    }

}

//delete category
export const deleteCategoryController = async(req,res) => {
    try{
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:'Category deleted successfully'
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error by creating category',
            error
        })

    }
}
