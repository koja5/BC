import { PreviewPostDialogComponent } from './../../modals/preview-post-dialog/preview-post-dialog.component';
import { Component, OnInit, HostListener } from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { PostModel } from "src/app/models/post-model";
import { HelpService } from "src/app/services/help.service";
import { Router } from "@angular/router";
import { InviteModel } from "src/app/models/invite-model";
import { MessageSubmitModel } from "src/app/models/message-submit-model";
import * as sha1 from "sha1";
import { ProfileService } from "src/app/services/profile.service";
import { ToastrService } from "ngx-toastr";
import $ from "jquery";
import { FileUploader, FileItem } from "ng2-file-upload";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { MessageService } from "src/app/services/message.service";
import { UserModel } from "src/app/models/user-model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DynamicDialogComponent } from "../../dynamic-elements/dynamic-dialog/dynamic-dialog.component";
import { ModalConfigurationService } from "src/app/services/modal-configuration.service";
import { FeedPostLikesDialogComponent } from "../../modals/feed-post-likes-dialog/feed-post-likes-dialog.component";
import { FeedInviteDialogComponent } from "../../modals/feed-invite-dialog/feed-invite-dialog.component";
import { ImageCropperDialogComponent } from '../../modals/image-cropper-dialog/image-cropper-dialog.component';
import { RecommendedDialogComponent } from '../../modals/recommended-dialog/recommended-dialog.component';

@Component({
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.scss"],
})
export class FeedComponent implements OnInit {
  public id: any;
  public data: any;
  public postData = new PostModel();
  public allPosts = [];
  public allPostsT = [];
  public selectedProcessOption = -1;
  public selectedFeedConnectionsOptions = -1;
  public likePostIndex = -1;
  public allLikesForPost: any;
  public commentInput: any;
  public postShowAllComments = -1;
  public user: any;
  public peopleYouMightKnowList: any;
  public simpleMember = false;
  public userType = 2;
  public language: any;
  public areYouSureRemoveWindow = false;
  public removeItem: any;
  public windowHeight: any;
  public windowWidth: any;
  public imageData: any;
  public loading = true;
  public linkClient = window.location.origin;
  public referralLinkCopied = false;
  public recommendedItem: any;
  public height: any;
  public imageChangedEvent: any = "";
  public showCropper = false;
  public typeOfUpload: any;
  public maxFileImageSize = 1 * 1024 * 1024;
  // public url = "http://localhost:3000/upload";
  public url = "https://116.203.85.82:" + location.port + "/upload";
  public uploader: FileUploader;
  public croppedImage: any = "";
  public loadImage = false;
  public promoWindow = false;
  public selectedMember = new UserModel();

  constructor(
    private service: FeedService,
    private helpService: HelpService,
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private message: MessageService,
    private modalService: NgbModal,
    private modalConfigurationService: ModalConfigurationService
  ) { }

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
    this.id = localStorage.getItem("id");
    this.user = JSON.parse(localStorage.getItem("user"));

    this.language = this.helpService.getLanguage();
    this.initialization();
    this.uploadInitialization();
    this.backOnTop();
  }

  initialization() {
    this.service.getUserInfoSHA1(this.id).subscribe((data) => {
      console.log(data);
      if (data !== null) {
        this.data = data[0];
        this.userType = data[0].type;
        // this.imageData = this.helpService.getImage(this.data.img);
        this.getAllPostForUser(this.data.id, this.data.sid);
      }
    });

    this.service.getPeopleYouMightKnow().subscribe((data: []) => {
      this.peopleYouMightKnowList = data;
    });
  }

  uploadInitialization() {
    this.uploader = new FileUploader({
      url: this.url,
      maxFileSize: 1 * 1024 * 1024,
    });

    this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
      console.log(fileItem);
      const date: number = new Date().getTime();
      const file = new File([this.croppedImage], "1.PNG", {
        type: "image/png",
        lastModified: date,
      });
      if (this.typeOfUpload === "img") {
        this.imageData = this.croppedImage;
      }
      fileItem = new FileItem(this.uploader, file, {});
      console.log(fileItem);
      form.append("description", fileItem.file["description"]);
      form.append(
        "date",
        fileItem.file.lastModifiedDate !== undefined
          ? fileItem.file.lastModifiedDate
          : new Date()
      );
      form.append("customer_id", this.data.id);
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      console.log(JSON.parse(response));
      const respon = JSON.parse(response);
      if (respon["info"]) {
        if (respon["type"] === "img") {
          this.data.image = respon["name"];
        } else {
          this.data.cover = respon["name"];
        }
      }
      this.loadImage = false;
    };
  }

  getAllPostForUser(id, sid) {
    const directorId = this.helpService.getMyDirectorUser(id, sid);
    console.log(directorId);
    this.service.getAllPostsForUser(directorId).subscribe((data: []) => {
      /*for (let i = 0; i < data.length; i++) {
        this.packUserData(data[i], data);
      }*/

      this.allPosts = data.sort((a, b) => {
        return new Date(b["date"]).getTime() - new Date(a["date"]).getTime();
      });
      this.loading = false;
      console.log(this.allPosts);
    });
  }

  packUserData(post, allPosts) {
    this.profileService.getUserInfoSHA1(post.user_id).subscribe((data) => {
      post.name = data[0]["fullname"];
      post.img = this.helpService.getImage(data[0]["img"]);
      let recommentArray = [];
      if (post.recomment.length !== 0) {
        for (let i = 0; i < post.recomment.length; i++) {
          this.profileService
            .getUserInfoSHA1(post.recomment[i].user_id)
            .subscribe((data) => {
              post.recomment[i].name = data[0]["fullname"];
              post.recomment[i].img = this.helpService.getImage(data[0]["img"]);
              recommentArray.push(post.recomment[i]);
              if (recommentArray.length === post.recomment.length) {
                this.allPostsT.push(post);
                if (this.allPostsT.length === allPosts["length"]) {
                  this.allPosts = this.allPostsT.sort((a, b) => {
                    return (
                      new Date(b["date"]).getTime() -
                      new Date(a["date"]).getTime()
                    );
                  });
                }
              }
            });
        }
      } else {
        this.allPostsT.push(post);
        if (this.allPostsT.length === allPosts["length"]) {
          this.allPosts = this.allPostsT.sort((a, b) => {
            return (
              new Date(b["date"]).getTime() - new Date(a["date"]).getTime()
            );
          });
        }
      }
    });
  }

  createPost() {
    const postData = {
      user_id: this.id,
      name: this.data.fullname,
      proffesion: "CEO",
      image: this.data.image,
      sid: this.data.sid,
      post: this.linkify(this.postData.post),
      date: new Date(),
      recomment: [],
      likes: [],
    };

    this.service.createPost(postData).subscribe((data) => {
      console.log(data);
      if (data["info"]) {
        this.postData._id = data["insertId"];
        this.allPosts.unshift(postData);
        this.postData = new PostModel();
      }
    });
  }

  linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(
      replacePattern1,
      '<a href="$1" target="_blank">$1</a>'
    );

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(
      replacePattern2,
      '$1<a href="http://$2" target="_blank">$2</a>'
    );

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(
      replacePattern3,
      '<a href="mailto:$1">$1</a>'
    );

    return replacedText;
  }

  showHidePostOption(id) {
    if (this.selectedProcessOption === -1) {
      this.selectedProcessOption = id;
    } else {
      this.selectedProcessOption = -1;
    }
  }

  showHideFeedConnections(id) {
    if (this.selectedFeedConnectionsOptions === -1) {
      this.selectedFeedConnectionsOptions = id;
    } else {
      this.selectedFeedConnectionsOptions = -1;
    }
  }

  deletePostQuestion(id, index) {
    this.removeItem = {
      id: id,
      index: index,
    };

    const modalRef = this.modalService.open(DynamicDialogComponent, {
      size: 'lg',
      centered: true
    });

    this.modalConfigurationService.setSettingsForAreYouSureDialog(modalRef.componentInstance, this.language);
    modalRef.componentInstance.modal = modalRef;

    modalRef.result.then(() => {
      this.service.deletePost(this.removeItem.id).subscribe((data) => {
        if (data) {
          this.allPosts.splice(this.removeItem.index, 1);
          this.selectedProcessOption = -1;
        }
      });
    }, () => {
      console.log(`Dismissed`)
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

  openFeedPostLikesDialog(id: any): void {
    const modalRef = this.modalService.open(FeedPostLikesDialogComponent, {
      size: 'sm',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.feedPostLikes,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.id = id;
  }

  showUserProfile(id) { }

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

  public openFeedInviteDialog(): void {
    const modalRef = this.modalService.open(FeedInviteDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.feedInviteTitle,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    } else {
      this.windowWidth = null;
      this.windowHeight = null;
    }
  }

  getImageFromBlob(image) {
    if (image) {
      return this.helpService.getImage(image);
    } else {
      return "../../../../assets/img/profile_image/no-image.png";
    }
  }

  copyLinkInClipboard() {
    const link =
      this.linkClient + "/login/join-to/" + this.id + "/null/null/null";
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.referralLinkCopied = true;
    this.toastr.success(this.language.feedCopiedLinkInClipboard, "", {
      timeOut: 7000,
      positionClass: "toast-bottom-right",
    });
  }

  backOnTop() {
    /*const scrollToTopButton = document.getElementById("js-top");
    let back = false;
    const scrollFunc = () => {
      let y = window.scrollY;
      if (y > 500) {
        scrollToTopButton.className = "top-link show";
      } else {
        scrollToTopButton.className = "top-link hide";
      }
    };

    window.addEventListener("scroll", scrollFunc);

    const scrollToTop = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0 && back) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 10);
      } else {
        back = false;
      }
    };

    scrollToTopButton.onclick = function (e) {
      back = true;
      e.preventDefault();
      scrollToTop();
    };*/

    (function () {
      $(document).ready(function () {
        return (
          $(window).scroll(function () {
            return $(window).scrollTop() > 200
              ? $("#back-to-top").addClass("show")
              : $("#back-to-top").removeClass("show");
          }),
          $("#back-to-top").click(function () {
            return $("html,body").animate({
              scrollTop: "0",
            });
          })
        );
      });
    }.call(this));
  }

  recommended(id, name, email, phone) {
    this.recommendedItem = {
      id: id,
      name: name,
      email: email,
      phone: phone,
    };

    const modalRef = this.modalService.open(RecommendedDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.recommendedTitle + ' ' + name,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.email = email;
    modalRef.componentInstance.phone = phone;

    modalRef.result.catch(() => {
      this.recommendedItem = null;
    });
    this.selectedFeedConnectionsOptions = -1;
  }

  fileChangeEventProfile(event: any): void {
    if (event.target.files[0].size <= this.maxFileImageSize) {
      this.imageChangedEvent = event;
      this.openCropperImageDialog();
      this.showCropper = true;
      this.typeOfUpload = "img";
    } else {
      this.toastr.error(this.language.adminMaxFileImage, "", {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      });
    }
  }

  openCropperImageDialog(): void {
    const modalRef = this.modalService.open(ImageCropperDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.profileUpdateProfileImage,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(reason);
    });
  }


  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
    this.showCropper = false;
  }
  cropperReady() {
    /*this.service.uploadImage(this.croppedImage).subscribe((data) => {
      console.log(data);
    });*/
  }
  loadImageFailed() {
    // show message
  }

  public save() {
    this.loadImage = true;
    const date: number = new Date().getTime();
    // Put the blob into the fileBits array of the File constructor
    const myFile = this.dataURItoBlob(this.croppedImage);
    const file = new File(
      [myFile],
      this.id.toString() + "-" + this.typeOfUpload,
      {
        type: "image/png",
        lastModified: date,
      }
    );
    console.log(file);
    const fileItem = new FileItem(this.uploader, file, { itemAlias: "1" });
    console.log(fileItem);
    this.uploader.queue = [];
    this.uploader.queue.push(fileItem);
    fileItem.upload();
    this.modalService.dismissAll();
    this.message.sendUserInfo();
  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: "image/jpg",
    });
  }

  openPromoVideo(item) {
    this.selectedMember = item;
    this.promoWindow = true;
    this.selectedFeedConnectionsOptions = -1;
  }

  promoWindowEmitter() {
    this.promoWindow = false;
  }

  sendMessageForThisUser(data) {
    sessionStorage.setItem("message_user", JSON.stringify(data));
    this.router.navigate(["/home/main/message"]);
  }

  public openPreviewPostDialog(): void {
    const modalRef = this.modalService.open(PreviewPostDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.feedPreviewPost,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => this.language.feedPost,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.data = this.data;
    modalRef.componentInstance.postData = this.postData;

    modalRef.result.then(() => {
      this.createPost();
      this.modalService.dismissAll();
    });
  }
}
