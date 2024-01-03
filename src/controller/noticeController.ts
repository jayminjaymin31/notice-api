import { db } from "../utils/db.server";
import { Request, Response } from "express";
import { commonMessages, commonStatus} from "../utils/contracts";

// Create notice


export const createNotice = async (req: Request, res: Response) => {
  const { title, event, imageUrl, description, link } = req.body;
  try {
    const newNotice = await db.notice.create({
      data: {
        title: title,
        event: event,
        imageUrl: imageUrl,
        description: description,
        link: link,
      },
    });

    return res.json({ status: commonStatus.success, data: newNotice, message: commonMessages.NOTICE_CREATION});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: commonStatus.failed, message:commonMessages.INTERNAL_SERVER_ERROR_MESSAGE });
  }
};




// Get notices



export const fetchNotice = async (req: Request, res: Response) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
  
    if (page <= 0) {
      page = 1;
    }
  
    if (limit <= 0 || limit > 100) {
      limit = 10;
    }
  
    const skip = (page - 1) * limit;
  
    try {
      // Fetch notices with pagination
      const notices = await db.notice.findMany({
        skip: skip,
        take: limit,
      });
  
      // Get the total count of notices
      const totalNotices = await db.notice.count();
  
      // Calculate total pages
      const totalPages = Math.ceil(totalNotices / limit);

      // If the requested page exceeds the total pages, set it to the last page
      if (page > totalPages) {
        page = totalPages;
      }

      // If there is no content on the requested page, return the previous page of data
      if (notices.length === 0 && totalPages > 1 && page > 1) {
        page--;
        const previousSkip = (page - 1) * limit;
        const previousNotices = await db.notice.findMany({
          skip: previousSkip,
          take: limit,
        });

        return res.json({
          status: commonStatus.success,
          message: commonMessages.FETCH_NOTICE,
          data: previousNotices,
          meta: {
            totalPages,
            currentPage: page,
            limit: limit,
          },
        });
      }

      // Otherwise, return the requested page of data
      return res.json({
        status: commonStatus.success,
        message: commonMessages.FETCH_NOTICE,
        data: notices,
        meta: {
          totalPages,
          currentPage: page,
          limit: limit,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: commonStatus.failed,
        message: commonMessages.INTERNAL_SERVER_ERROR_MESSAGE,
      });
    }
};




  
//get notice by id




export const showNotice = async (req: Request, res: Response) => {
    const noticeId = req.params.id; 
  
    try {
      const notice = await db.notice.findUnique({
        where: {
          id: noticeId,
        },
      });
  
      if (!notice) {
        return res.status(404).json({ status: commonStatus.not_found, message: commonMessages.FETCH_NOTICE_ERROR_MESSAGE});
      }
  
      return res.json({
        status: commonStatus.success,
        data: notice,
        message: commonMessages.FETCH_NOTICE,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: commonStatus.failed, message: commonMessages.INTERNAL_SERVER_ERROR_MESSAGE });
    }
  };



  //update notice by id



  export const updateNotices = async (req: Request, res: Response) => {
    const noticeId = req.params.id; 
    const { title, event, imageUrl, description, link } = req.body;
  
    try {
      const newNotice = await db.notice.update({
        where: {
          id: noticeId,
        },
        data: {
            title: title,
            event: event,
            imageUrl: imageUrl,
            description: description,
            link: link,
          },
      });
  
      return res.json({ status: commonStatus.success, data: newNotice, message: commonMessages.UPDATE_NOTICE});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: commonStatus.failed, message: commonMessages.INTERNAL_SERVER_ERROR_MESSAGE });
    }
  };




//Delete Notice By Id




export const deleteNotice = async (req: Request, res: Response) => {
    const noticeId = req.params.id;
  
    try {
      const deletedNotice = await db.notice.delete({
        where: {
          id: noticeId,
        },
      });
  
      if (!deletedNotice) {
        return res.status(404).json({ status: commonStatus.not_found, message: commonMessages.NOTICE_NOT_FOUND });
      }
  
      return res.json({
        status: commonStatus.success,
        data: deletedNotice,
        message: commonMessages.DELETE_NOTICE,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: commonStatus.failed, message: commonMessages.INTERNAL_SERVER_ERROR_MESSAGE });
    }
  };

//search by title or any




export const searchNotice = async (req: Request, res: Response) => {
    const query = (req.query.q as string).toLowerCase(); // Convert search query to lowercase
  
    try {
      const notices = await db.notice.findMany({
        where: {
          OR: [
            { description: { contains: query } },
            { event: { contains: query } },
            { title: { contains: query } },
            { imageUrl: { contains: query } },
            { link: { contains: query } },
          ],
        },
      });
  
      if (notices.length === 0) {
        return res.status(404).json({ status: commonStatus.not_found, message: commonMessages.NO_RESULTS_FOUND });
      }
  
      return res.json({ status: commonStatus.success, data: notices });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: commonStatus.failed, message: commonMessages.INTERNAL_SERVER_ERROR_MESSAGE });
    }
  };