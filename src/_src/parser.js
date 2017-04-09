/* global $ */

export default class {
    constructor( selectors ) {
        const defaults = Object.freeze( {
            QuestionCommentsRootSelector: 'ul[role="question_comments_list"]',
            SolutionsRootSelector: '#solutions > ul#solutions_list',
            AnswersRootSelector: '#answers > ul#answers_list',
            TagsListRootSelector: '#question_show ul.tags-list',
            FeedRootSelector: 'ul.content-list[role="content-list"]'
        } );
        this.selectors = Object.assign( {}, defaults, selectors || {} );
    }

    getQuestionComments( source ) {
        const QuestionComments = $( source ).find( this.selectors.QuestionCommentsRootSelector ).find( 'li.content-list__item[role="comments_item"]' );

        const QuestionCommentsJSON = $( QuestionComments ).map( ( i, comment ) => {
            const result = {
                id: $( comment ).attr( 'id' ),
                content: $( comment ).html(),
                questionComment: true,
                answer: false,
                solution: false
            };
            return result;
        } ).get();
        return QuestionCommentsJSON;
    }

    getSolutions( source ) {
        const Solutions = $( source ).find( this.selectors.SolutionsRootSelector ).find( 'li.content-list__item[role^="answer_item"]' ).get();
        return Solutions;
    }

    getAnswers( source ) {
        const Answers = $( source ).find( this.selectors.AnswersRootSelector ).find( 'li.content-list__item[role^="answer_item"]' ).get();
        return Answers;
    }

    getTagsList( source ) {
        const TagsList = $( source ).find( this.selectors.TagsListRootSelector ).find( 'li.tags-list' ).get();
        return TagsList;
    }

    getFeed( source ) {
        const Feed = $( source ).find( this.selectors.FeedRootSelector ).find( 'li.content-list__item' ).get();
        return Feed;
    }

}
