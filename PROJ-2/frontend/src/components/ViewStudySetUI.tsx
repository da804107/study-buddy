import '../styles/ViewStudySetUI.css';
import React, { useEffect, useState } from 'react';

const ViewStudySetUI: React.FC<{
    studySet: {
        id: string;
        name: string;
        flashcards: { id: string; term: string; definition: string }[];
        isEditingName: boolean;
    };
    isAddingFlashcard?: boolean;
    setIsAddingFlashcard: (value: boolean) => void;
    term: string;
    setTerm: (value: string) => void;
    definition: string;
    setDefinition: (value: string) => void;
    isCardView: boolean;
    setIsCardView: (value: boolean) => void;
    handleDeleteSet: () => void;
    handleEditSetName: () => void;
    handleSaveSetName: (newName: string) => void;
    handleAddFlashcard: () => void;
    handleDeleteFlashcard: (id: string) => void;
    handleEditFlashcard: (id: string, newTerm: string, newDefinition: string) => void;
}> = ({
    studySet,
    isAddingFlashcard = false,
    setIsAddingFlashcard,
    term,
    setTerm,
    definition,
    setDefinition,
    isCardView,
    setIsCardView,
    handleDeleteSet,
    handleEditSetName,
    handleSaveSetName,
    handleAddFlashcard,
    handleDeleteFlashcard,
    handleEditFlashcard,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard =
        studySet.flashcards && studySet.flashcards.length > 0
            ? studySet.flashcards[currentIndex]
            : null;

    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % studySet.flashcards.length);
    };

    const handlePreviousCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) =>
            (prev - 1 + studySet.flashcards.length) % studySet.flashcards.length
        );
    };

    return (
        <div className="study-set-page">
            <div className="header">
                <button
                    className="home-button"
                    onClick={() => (window.location.href = '/homePage')}
                >
                    HOME
                </button>
            </div>
            <div className="study-set-header">
                {studySet.isEditingName ? (
                    <div className="edit-set-name">
                        <input
                            type="text"
                            defaultValue={studySet.name}
                            onBlur={(e) => handleSaveSetName(e.target.value)}
                            autoFocus
                        />
                        <button onClick={() => handleEditSetName()}>CANCEL</button>
                    </div>
                ) : (
                    <h2>{studySet.name}</h2>
                )}
            </div>
            <div className="actions">
                <button onClick={() => setIsAddingFlashcard(true)}>ADD</button>
                <button onClick={() => setIsCardView(!isCardView)}>
                    {isCardView ? 'LIST VIEW' : 'CARD VIEW'}
                </button>
            </div>
            {isAddingFlashcard && (
                <div className="add-flashcard">
                    <input
                        type="text"
                        placeholder="Term"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Definition"
                        value={definition}
                        onChange={(e) => setDefinition(e.target.value)}
                    />
                    <div className="add-card-buttons">
                        <button onClick={handleAddFlashcard}>SAVE</button>
                        <button onClick={() => setIsAddingFlashcard(false)}>CANCEL</button>
                    </div>
                </div>
            )}
            {isCardView && currentCard ? (
                <div>
                    <div
                        className={`card ${isFlipped ? 'flipped' : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className="card-inner">
                            <div className="card-front">{currentCard.term}</div>
                            <div className="card-back">{currentCard.definition}</div>
                        </div>
                    </div>
                    <div className="card-buttons">
                        <button onClick={handlePreviousCard}>PREVIOUS</button>
                        <button onClick={handleNextCard}>NEXT</button>
                    </div>
                </div>
            ) : (
                !isCardView && (
                    <div className="flashcards">
                        {studySet.flashcards.map((card) => (
                            <div className="flashcard" key={card.id}>
                                <div className="term">{card.term}</div>
                                <div className="definition">{card.definition}</div>
                                <div className="flashcard-buttons">
                                    <button
                                        onClick={() => {
                                            const newTerm = prompt('Edit Term:', card.term) || card.term;
                                            const newDefinition = prompt('Edit Definition:', card.definition) || card.definition;
                                            if (newTerm && newDefinition) {
                                                handleEditFlashcard(card.id, newTerm, newDefinition);
                                            }
                                        }}
                                    >
                                        EDIT
                                    </button>
                                    <button onClick={() => handleDeleteFlashcard(card.id)}>
                                        DELETE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default ViewStudySetUI;
