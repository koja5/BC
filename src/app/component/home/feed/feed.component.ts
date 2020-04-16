import { Component, OnInit } from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { PostModel } from "src/app/models/post-model";
import { HelpService } from "src/app/services/help.service";
import { Router } from "@angular/router";
import { InviteModel } from "src/app/models/invite-model";
import { MessageSubmitModel } from "src/app/models/message-submit-model";
import * as sha1 from "sha1";

@Component({
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.scss"],
})
export class FeedComponent implements OnInit {
  public id: any;
  public data: any;
  public postData = new PostModel();
  public allPosts: any;
  public selectedProcessOption = -1;
  public likePostIndex = -1;
  public postLikes = false;
  public allLikesForPost: any;
  public commentInput: any;
  public postShowAllComments = -1;
  public user: any;
  public inviteWindows = false;
  public invite = new InviteModel();
  public inviteInfo = new MessageSubmitModel();
  public peopleYouMightKnowList: any;
  public simpleMember = false;
  public userType = 2;

  constructor(
    private service: FeedService,
    private helpService: HelpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = localStorage.getItem("id");
    this.user = JSON.parse(localStorage.getItem("user"));
    if (this.user.type === sha1(0)) {
      this.userType = 0;
    } else if (this.user.type === sha1(1)) {
      this.userType = 1;
    } else if (this.user.type === sha1(2)) {
      this.userType = 2;
    } else if (this.user.type === sha1(3)) {
      this.userType = 3;
    }
    this.initialization();
  }

  initialization() {
    this.service.getUserInfoSHA1(this.id).subscribe((data) => {
      console.log(data);
      if (data !== null) {
        this.data = data[0];

        this.getAllPostForUser(this.data.id, this.data.sid);
      }
    });

    this.service.getPeopleYouMightKnow().subscribe((data) => {
      this.peopleYouMightKnowList = data;
    });
  }

  getAllPostForUser(id, sid) {
    const directorId = this.helpService.getMyDirectorUser(id, sid);
    console.log(directorId);
    this.service.getAllPostsForUser(directorId).subscribe((data: []) => {
      this.allPosts = data.sort((a, b) => {
        return new Date(b["date"]).getTime() - new Date(a["date"]).getTime();
      });
      console.log(data);
    });
  }

  createPost() {
    this.postData = {
      user_id: this.id,
      name: this.data.fullname,
      proffesion: "CEO",
      image: this.data.image,
      sid: this.data.sid,
      post: this.postData.post,
      date: new Date(),
      recomment: [],
      likes: [],
    };

    this.service.createPost(this.postData).subscribe((data) => {
      console.log(data);
      if (data["info"]) {
        this.postData._id = data["insertId"];
        this.allPosts.unshift(this.postData);
        this.postData = new PostModel();
      }
    });
  }

  showHidePostOption(id) {
    if (this.selectedProcessOption === -1) {
      this.selectedProcessOption = id;
    } else {
      this.selectedProcessOption = -1;
    }
  }

  deletePost(id, index) {
    this.service.deletePost(id).subscribe((data) => {
      if (data) {
        this.allPosts.splice(index, 1);
        this.selectedProcessOption = -1;
      }
    });
  }

  likePost(id, index) {
    const likePostData = {
      id: id,
      user_id: this.id,
      name: this.data.fullname,
      image: this.data.image,
    };
    this.service.likePost(likePostData).subscribe((data) => {
      console.log(data);
      if (data["info"] === 201) {
        this.allPosts[index].likes.push(likePostData);
        // this.allPosts[index].likes.length++;
      } else if (data["info"] === 202) {
        // this.allPosts[index].likes.splice(index, 1);
        this.unLikedUser(index);
      }
    });
  }

  unLikedUser(index) {
    for (let i = 0; i < this.allPosts[index].likes.length; i++) {
      if (this.allPosts[index].likes[i].user_id === this.id) {
        this.allPosts[index].likes.splice(i, 1);
        break;
      }
    }
  }

  checkLikedPost(item) {
    for (let i = 0; i < item.length; i++) {
      if (item[i] !== undefined && item[i].user_id === this.id) {
        return true;
      }
    }

    return false;
  }

  getLikesForPost(id) {
    this.service.getLikesForPost(id).subscribe((data) => {
      console.log(data);
      this.allLikesForPost = data["likes"];
      this.postLikes = true;
    });
  }

  showUserProfile(id) {}

  createComment(id, index) {
    const commentPostData = {
      id: id,
      comment: this.allPosts[index].newComment,
      user_id: this.id,
      date: new Date(),
      name: this.data.fullname,
      image: this.data.image,
      recomment: [],
      likes: [],
    };
    this.service.commentPost(commentPostData).subscribe((data) => {
      console.log(data);
      if (data["info"] === 201) {
        commentPostData["_id"] = data["insertId"];
        this.allPosts[index].recomment.push(commentPostData);
        this.allPosts[index].newComment = null;
      }
    });
  }

  showAllComments(id) {
    if (this.postShowAllComments === -1) {
      this.postShowAllComments = id;
    } else {
      this.postShowAllComments = -1;
    }
  }

  openProfile(id) {
    this.router.navigate(["/home/main/profile/" + sha1(id.toString())]);
  }

  openProfileWithoutSHA1(id) {
    this.router.navigate(["/home/main/profile/" + id]);
  }

  sendInviteFriend(invite) {
    console.log(this.invite);
    if (this.invite.email && this.invite.message) {
      this.invite.directorId = localStorage.getItem("id");
      this.service.sendInviteFriend(this.invite).subscribe((data) => {
        console.log(data);
      });

      this.inviteInfo.show = true;
      this.inviteInfo.status = "success";
      this.inviteInfo.message = "Your invite is send!";

      setTimeout(() => {
        this.inviteWindows = false;
      }, 2000);
    } else {
      this.inviteInfo.show = true;
      this.inviteInfo.status = "error";
      this.inviteInfo.message = "Please input all required data!";
    }
  }
}
